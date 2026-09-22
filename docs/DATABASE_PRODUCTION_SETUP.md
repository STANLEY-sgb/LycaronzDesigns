# LYCARONZ DESIGNS — Production Database & Deployment Guide

This guide details how to configure LYCARONZ DESIGNS for production on Vercel with a managed PostgreSQL database (such as Neon, Supabase, or Vercel Postgres).

---

## 1. Why PostgreSQL for Production?

In local development, the app uses SQLite (`file:./prisma/dev.db`).
On Vercel (and other serverless platforms), functions run in stateless, ephemeral environments where the local filesystem is read-only (except `/tmp`) and not shared across serverless instances.

A managed PostgreSQL database provides:
- Persistent, multi-region connection pooling
- Concurrency for simultaneous customer orders, inquiries, and admin sessions
- Automatic backups and zero data loss on function cold starts

---

## 2. Setting Up Managed PostgreSQL

Recommended free/managed providers:
- **Neon** (neon.tech) — Serverless Postgres with pooling built-in (recommended for Next.js)
- **Supabase** (supabase.com) — PostgreSQL with connection pooler (port 6543)
- **Vercel Postgres** — Integrated into Vercel dashboard via Neon

### Step A: Obtain Your Connection String
From your database dashboard, copy the pooled connection string:
```env
DATABASE_URL="postgresql://username:password@ep-cool-pool-123456.us-east-1.aws.neon.tech/lycaronz?sslmode=require"
```

### Step B: Update `prisma/schema.prisma` for PostgreSQL
Change line 7 in `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step C: Run Migrations on the Production Database
Run:
```bash
npx prisma db push
# or
npx prisma migrate deploy
```

### Step D: Seed the Initial Admin Account & Catalog
Run:
```bash
npm run seed
```

---

## 3. Required Environment Variables on Vercel

In your **Vercel Project Settings → Environment Variables**, add:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `AUTH_SECRET` | NextAuth JWT secret (32+ chars) | Generate via `openssl rand -base64 32` |
| `NEXTAUTH_SECRET` | Alias for NextAuth JWT secret | Same as `AUTH_SECRET` |
| `NEXTAUTH_URL` | Production website URL | `https://lycaronzdesigns.com` |
| `AUTH_URL` | Alias for production website URL | `https://lycaronzdesigns.com` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage access token | Auto-configured when connecting Vercel Blob store |
| `ADMIN_EMAIL` | Default admin email (for seed) | `admin@lycaronzdesigns.com` |
| `ADMIN_PASSWORD` | Default admin password (for seed) | Strong password |
| `SMTP_HOST` | Gmail / Brevo / SendGrid SMTP host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_SECURE` | Use SSL/TLS | `false` |
| `SMTP_USER` | Email username | `info.lycaronz@gmail.com` |
| `SMTP_PASS` | Gmail 16-character App Password | `abcd efgh ijkl mnop` |
| `EMAIL_TO` | Recipient for customer inquiries | `info.lycaronz@gmail.com` |
| `EMAIL_FROM` | Sender display name & address | `LYCARONZ DESIGNS <info.lycaronz@gmail.com>` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Contact WhatsApp number | `256702084480` |

---

## 4. Verification Checklist

1. **Build Step:** `npm run build` succeeds cleanly without errors.
2. **Admin Login:** Visit `/admin/login` and verify login with seeded credentials.
3. **Uploads:** Verify product image upload saves to Vercel Blob (`*.public.blob.vercel-storage.com`).
4. **Forms:** Submit a test message on `/contact` and test booking on `/book-appointment`.
5. **Admin Dashboard:** Confirm appointments, orders, and inquiries appear instantly in `/admin/dashboard`.
