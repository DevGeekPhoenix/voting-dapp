/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === "production",
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === "production",
  },
};

module.exports = nextConfig;
