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
      // ── External image sources ────────────────────────────────────────────
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      // ── Local development: uploads served from Next.js dev server ─────────
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
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3001',
        pathname: '/uploads/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    // Run ESLint during builds so regressions are caught in CI/Vercel
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
