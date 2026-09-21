import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { auth } from '@/auth';

interface Visit {
  path: string;
  referrer: string;
  ua: string;
  ip: string;
  time: string;
}

const VISITS_FILE = path.join(process.cwd(), 'data', 'visits.json');

async function readVisits(): Promise<Visit[]> {
  try {
    const raw = await fs.promises.readFile(VISITS_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch {
    return [];
  }
}

async function appendVisit(entry: Visit) {
  try {
    await fs.promises.mkdir(path.dirname(VISITS_FILE), { recursive: true });
    const arr = await readVisits();
    arr.push(entry);
    // keep last 1000
    const trimmed = arr.length > 1000 ? arr.slice(-1000) : arr;
    await fs.promises.writeFile(VISITS_FILE, JSON.stringify(trimmed, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to append visit:', e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const p = body.path || '/';
    const referrer = body.referrer || 'none';
    const ua = request.headers.get('user-agent') || 'unknown';
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    const now = Date.now();
    const throttleSeconds = Number(process.env.VISIT_EMAIL_THROTTLE_SECONDS) || 60; // default 60s

    // read existing visits to check last time for this IP
    const visits = await readVisits();
    const lastForIp = visits.slice().reverse().find(v => v.ip === ip);
    let shouldEmail = true;
    if (lastForIp) {
      const lastTime = Date.parse(lastForIp.time);
      if (!isNaN(lastTime) && (now - lastTime) < throttleSeconds * 1000) {
        shouldEmail = false; // throttle
      }
    }

    const entry = { path: p, referrer, ua, ip, time: new Date(now).toISOString() };
    // always append visit
    await appendVisit(entry);

    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'info.sharontylors@gmail.com';
    const smtpHost = process.env.SMTP_HOST;

    if (smtpHost && shouldEmail) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
        });

        await transporter.sendMail({
          from: process.env.FROM_EMAIL || 'no-reply@sharon-tailors.com',
          to: adminEmail,
          subject: `Site visit: ${p}`,
          text: `A visitor was detected on the site\n\nPath: ${p}\nReferrer: ${referrer}\nIP: ${ip}\nUser-Agent: ${ua}\nTime: ${entry.time}`,
        });
        console.log('Visit email sent to', adminEmail);
      } catch (err) {
        console.error('Failed to send visit email:', err);
      }
    } else if (!smtpHost) {
      console.log('Visit (no SMTP):', entry);
    } else if (!shouldEmail) {
      console.log('Visit email throttled for IP', ip);
    }

    return NextResponse.json({ success: true, emailed: Boolean(smtpHost && shouldEmail), throttled: !shouldEmail }, { status: 201 });
  } catch (err) {
    console.error('Visit tracking error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function GET() {
  // Admin-only: return recent visits
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const raw = await fs.promises.readFile(VISITS_FILE, 'utf8').catch(() => '[]');
    const arr = JSON.parse(raw || '[]');
    const recent = arr.slice(-100).reverse();
    return NextResponse.json(recent);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
