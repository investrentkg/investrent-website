/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'sqpepaiqwxginqnglspl.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,  // ignoruj błędy ESLint przy buildzie
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
