/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Serve modern formats (avif, webp) where supported
    formats: ['image/avif', 'image/webp'],
    // Sensible default quality — reduces file size while maintaining visual quality
    deviceSizes: [320, 360, 414, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blob.vercelusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      // Allow local dev uploads served from localhost:3000
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
      // Allow local dev uploads served from localhost:3001
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
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
