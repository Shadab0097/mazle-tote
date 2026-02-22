/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy API calls to backend (works in dev and production with PM2)
  async rewrites() {
    const apiUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },

  // Restrict remote images to your actual domains only
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // Production hardening
  poweredByHeader: false,
  compress: true,

  // Strict React mode for catching bugs early
  reactStrictMode: true,
};

export default nextConfig;
