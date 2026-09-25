# Lycaronz Designs — repair record

Prepared so the work can be billed. Live site checked: https://lycaronz.vercel.app
Confirmed failure before the repair: `GET /api/products` returned HTTP 500 `{"error":"Failed to fetch products"}`. The public pages still render, but the catalog, orders, bookings, and contact form cannot save or load from the database.

## What was wrong

The Vercel app was never actually connected to Supabase as an application. It uses Prisma. Supabase was only the Postgres host. The shipped database files were still SQLite, so Supabase rejected them.

1. Migrations were SQLite (`DATETIME`, `REAL`, `PRAGMA`). Supabase is Postgres, so `prisma migrate deploy` cannot create the tables.
2. `migration_lock.toml` was locked to `sqlite` while `schema.prisma` said `postgresql`.
3. The schema had no `directUrl`. On Vercel, the Supabase transaction pooler (port 6543) cannot run migrations, and Prisma prepared statements fail on that pooler unless `pgbouncer=true` and `connection_limit=1` are set. The direct host `db.<project>.supabase.co` is often IPv6-only, which Vercel cannot reach.
4. `scripts/ensure-prisma-provider.mjs` rewrote the schema back to SQLite whenever `DATABASE_URL` was missing at build time. Vercel then generated the wrong database client.
5. Login used `PrismaAdapter` together with JWT credentials. The adapter expects `Account`, `Session`, and `VerificationToken` tables that do not exist. Auth.js on Vercel also needs `trustHost`, or the host is rejected in production.
6. The seed reset the admin password on every run and printed the password into the logs.
7. Cloudinary was read as `CLOUDINARY_CLOUD_NAME`, while the env example used `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`. Uploads failed closed with no clear error.
8. Creating a product rejected a missing price even though the database allows a custom-quote item. Editing a product with no price crashed on `price.toString()`. Deleting a product that already had orders failed with a database constraint and a generic error.
9. The homepage hid a database failure and showed an empty catalog.
10. `.env.vercel.production` is committed in the public GitHub repo and contains live credentials. `.gitignore` did not cover that filename. The old delivery report said no secrets were committed. That statement is false. Those secrets should be rotated.

## What was corrected in the code

| Area | Correction |
| --- | --- |
| Database | Datasource is Postgres only, with `DATABASE_URL` for the app and `DIRECT_URL` for migrations. |
| Migrations | SQLite migration history removed. One Postgres baseline added: `prisma/migrations/20260925100000_init_postgres`. Tables: users, products, appointments, orders, inquiries. |
| Build | `npm run build` now runs `scripts/vercel-build.mjs`: it refuses a SQLite URL, requires a session-mode `DIRECT_URL` when the app URL is port 6543, generates the client, applies migrations, then seeds only if admin env vars exist. |
| Runtime | `lib/database-url.ts` adds `sslmode=require`, `pgbouncer=true`, and `connection_limit=1` when the URL is the Supabase transaction pooler. |
| Auth | Removed the Prisma adapter. Enabled `trustHost`. Added `types/next-auth.d.ts` so the session user id is typed. |
| Seed | Does not invent a default password. Does not print the password. Does not overwrite an existing admin password on later deploys. |
| Uploads | Reads both Cloudinary env names and returns a clear 503 when storage is not configured. |
| Products | Optional price is accepted. Null price no longer crashes the admin editor. A product with orders returns a clear 409 instead of a generic failure. |
| Orders API | Database errors return a controlled 500. |
| Homepage | A failed catalog request shows an error instead of a blank grid. |
| Env template | `.env.example` now documents the two Supabase URLs and the server-side Cloudinary names. |
| Secrets file | `.gitignore` now ignores `.env.vercel.production`. The file is still in Git history until the next commit removes it. |

## What is not finished on the live site

The code on this computer is fixed. https://lycaronz.vercel.app is still the old deployment, so `/api/products` will keep returning 500 until the new code is deployed and these Vercel environment variables exist:

- `DATABASE_URL` — Supabase **transaction** pooler, port **6543**, user `postgres.<project-ref>`
- `DIRECT_URL` — Supabase **session** pooler, port **5432**, same user
- `AUTH_SECRET`, `NEXTAUTH_SECRET`, `AUTH_URL`, `NEXTAUTH_URL` (the live https URL)
- `AUTH_TRUST_HOST=true`
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` (used once to create the admin; later deploys will not reset it)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Existing SMTP variables if email notifications should send

The browser available to this repair is not the already-open Google Chrome window, so the Supabase and Vercel sessions in that Chrome window could not be used. Supabase in the repair browser is sitting on the sign-in page. After you sign in there, the pooler URLs can be copied into the Vercel project `lycaronz` and the site redeployed.

Do not paste passwords into chat. Rotate every secret that was in the committed `.env.vercel.production` file, because that file is public on GitHub.

## Suggested invoice lines

1. Diagnosis of the live Vercel 500 and the Supabase connection failure.
2. Replace the SQLite database setup with a Supabase Postgres setup that Vercel can migrate and query.
3. Fix production login, seed safety, Cloudinary configuration, and catalog/product errors.
4. Stop the production env file from being the ignored-but-committed secret dump, and document the required Vercel variables.
5. Remaining go-live step: sign in, set the two Supabase URLs on Vercel, deploy, and confirm `/api/products` returns the catalog.
