Deployment to Vercel — LYCARONZ DESIGNS

1) Create a GitHub repo
   - git init
   - git add .
   - git commit -m "Initial commit"
   - Create repo on GitHub and push

2) Import project into Vercel
   - Go to https://vercel.com/new -> Import Git Repository
   - Framework: Next.js (auto-detected)
   - Build Command: npm run build
   - Output Directory: (leave default)

3) Environment variables (set in Project Settings -> Environment Variables):
   - DATABASE_URL = (production DB, e.g. postgres://...)
   - NEXTAUTH_URL = https://YOUR_DOMAIN
   - NEXTAUTH_SECRET = <generate_secure_random_value>
   - BLOB_READ_WRITE_TOKEN = <optional Vercel Blob token> (if using Vercel Blob storage)
   - NEXT_PUBLIC_WHATSAPP_NUMBER = +2567XXXXXXX

4) Uploads & storage
   - Local dev stores files in public/uploads. For production, either:
     a) Use Vercel Blob: set BLOB_READ_WRITE_TOKEN and the API will use @vercel/blob
     b) Or integrate S3/Cloud storage and update app/api/upload/route.ts accordingly

5) Domain & SEO
   - Add custom domain in Vercel and configure DNS
   - Update public/robots.txt and public/sitemap.xml replacing YOUR_DOMAIN
   - Submit sitemap URL to Google Search Console for indexing

6) Post-deploy
   - Visit https://YOUR_DOMAIN and verify pages
   - Login to /admin/login and change admin password
   - Optional: enable automatic branch deploys and Protect main branch

If you want, I can:
- Add dynamic sitemap generation (including product pages)
- Configure automatic uploading to Vercel Blob or S3
- Walk through adding the site to Google Search Console and submitting the sitemap
