module.exports = {
  apps: [
    {
      name: 'osori-server-pm2',
      script: 'src/index.ts',
      watch: true,
      autorestart: true,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
