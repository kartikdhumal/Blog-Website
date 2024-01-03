/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
      ignoreDuringBuilds: true,
    },
    images: {
      domains: ["res.cloudinary.com"],
    },
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.module.rules.push({
          test: /\.html$/,
          exclude: /node_modules/,
          use: 'ignore-loader',
        });
      }
  
      return config;
    },
  };
  
  module.exports = nextConfig;
  