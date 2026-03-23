/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Alchemy AccountKit / viem
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig;
