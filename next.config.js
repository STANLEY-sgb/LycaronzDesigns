/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Serve modern formats (avif, webp) where supported
    formats: ['image/avif', 'image/webp'],
    // Sensible device widths — covers 320px phones through 4K
    deviceSizes: [320, 360, 414, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      // ── Vercel Blob storage (production uploads) ──────────────────────────
      // Public blobs are served from *.public.blob.vercel-storage.com
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      // ── Cloudinary storage (production media) ────────────────────────────
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // ── External image sources ────────────────────────────────────────────
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      // ── Local development only ────────────────────────────────────────────
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Note: eslint key removed — Next.js 14 does not support it in next.config.js.
  // ESLint configuration lives in .eslintrc.json.
};

module.exports = nextConfig;
