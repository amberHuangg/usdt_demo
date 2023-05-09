const { version } = require('./package.json')

const nextConfig = {
  reactStrictMode: false,
  distDir: 'build',
  pageExtensions: ['page.tsx'],
  experimental: {
    images: {
      unoptimized: true,
    },
  },
  env: {
    APP_ENV: process.env.APP_ENV,
    APP_ENV_VERSION: version,
  },
}

module.exports = nextConfig
