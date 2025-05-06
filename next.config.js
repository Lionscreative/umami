require('dotenv').config();
const pkg = require('./package.json');

module.exports = {
  env: {
    VERSION: pkg.version,
  },
  basePath: process.env.BASE_PATH,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.js$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'PUT, POST, PATCH, DELETE, GET',
          },
        ],
      },
      {
        source: `/(.*\\.js)`,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000', // 30 days
          },
        ],
      },
    ];
  },
};
