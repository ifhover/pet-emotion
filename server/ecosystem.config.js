module.exports = {
  apps: [
    {
      name: 'pet-server',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 7000,
      },
    },
  ],
};
