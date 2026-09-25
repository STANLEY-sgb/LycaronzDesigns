// Copies the local SQLite shop data into Supabase.
// Existing logins are kept: a user that already exists is not deleted,
// and that user's password is not replaced.
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { PrismaClient } from '@prisma/client';

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const eq = trimmed.indexOf('=');
    const key = trimmed.slice(0, eq).trim();
    if (process.env[key]) continue;
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnvFile(path.join(process.cwd(), '.env'));

const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!databaseUrl || databaseUrl.startsWith('file:') || databaseUrl.includes('[SENSITIVE]')) {
  console.error('Set DIRECT_URL to the new Supabase session pooler (port 5432) before importing.');
  process.exit(1);
}

const sqlitePath = path.join(process.cwd(), 'prisma', 'dev.db.backup');
if (!fs.existsSync(sqlitePath)) {
  console.error('SQLite backup not found at prisma/dev.db.backup');
  process.exit(1);
}

function asDate(value) {
  if (value == null || value === '') return new Date();
  if (typeof value === 'number') return new Date(value);
  const asNumber = Number(value);
  if (Number.isFinite(asNumber) && String(value).trim() !== '' && asNumber > 1_000_000_000_000) {
    return new Date(asNumber);
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function asBool(value) {
  return value === true || value === 1 || value === '1';
}

const sqlite = new DatabaseSync(sqlitePath);
const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });

async function main() {
  const users = sqlite.prepare('SELECT * FROM users').all();
  const products = sqlite.prepare('SELECT * FROM products').all();
  const appointments = sqlite.prepare('SELECT * FROM appointments').all();
  const orders = sqlite.prepare('SELECT * FROM orders').all();
  const inquiries = sqlite.prepare('SELECT * FROM inquiries').all();

  let usersCreated = 0;
  let usersKept = 0;
  for (const row of users) {
    const existing = await prisma.user.findUnique({ where: { email: row.email } });
    if (existing) {
      await prisma.user.update({
        where: { email: row.email },
        data: { name: row.name, isAdmin: asBool(row.isAdmin) },
      });
      usersKept++;
      continue;
    }
    await prisma.user.create({
      data: {
        id: row.id,
        email: row.email,
        password: row.password,
        name: row.name,
        isAdmin: asBool(row.isAdmin),
        createdAt: asDate(row.createdAt),
        updatedAt: asDate(row.updatedAt),
      },
    });
    usersCreated++;
  }

  for (const row of products) {
    const data = {
      name: row.name,
      description: row.description,
      price: row.price,
      category: row.category,
      image: row.image,
      imageUrl: row.imageUrl,
      video: row.video,
      featured: asBool(row.featured),
      createdAt: asDate(row.createdAt),
      updatedAt: asDate(row.updatedAt),
    };
    await prisma.product.upsert({
      where: { id: row.id },
      update: data,
      create: { id: row.id, ...data },
    });
  }

  for (const row of appointments) {
    const data = {
      name: row.name,
      phone: row.phone,
      email: row.email,
      date: asDate(row.date),
      service: row.service,
      notes: row.notes,
      status: row.status,
      createdAt: asDate(row.createdAt),
      updatedAt: asDate(row.updatedAt),
    };
    await prisma.appointment.upsert({
      where: { id: row.id },
      update: data,
      create: { id: row.id, ...data },
    });
  }

  for (const row of orders) {
    const data = {
      productId: row.productId,
      name: row.name,
      email: row.email,
      phone: row.phone,
      message: row.message,
      status: row.status,
      createdAt: asDate(row.createdAt),
      updatedAt: asDate(row.updatedAt),
    };
    await prisma.order.upsert({
      where: { id: row.id },
      update: data,
      create: { id: row.id, ...data },
    });
  }

  for (const row of inquiries) {
    const data = {
      name: row.name,
      email: row.email,
      phone: row.phone,
      subject: row.subject,
      message: row.message,
      status: row.status,
      refId: row.refId,
      createdAt: asDate(row.createdAt),
      updatedAt: asDate(row.updatedAt),
    };
    await prisma.inquiry.upsert({
      where: { id: row.id },
      update: data,
      create: { id: row.id, ...data },
    });
  }

  console.log(`Users already there, left signed in: ${usersKept}`);
  console.log(`Users copied from SQLite: ${usersCreated}`);
  console.log(`Products copied: ${products.length}`);
  console.log(`Appointments copied: ${appointments.length}`);
  console.log(`Orders copied: ${orders.length}`);
  console.log(`Inquiries copied: ${inquiries.length}`);
}

main()
  .catch((error) => {
    console.error('SQLite import failed.');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    sqlite.close();
    await prisma.$disconnect();
  });
