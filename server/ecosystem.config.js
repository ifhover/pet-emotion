module.exports = {
  apps: [
    {
      name: 'pet-server',
      script: 'dist/src/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        PORT: 7000,
      },
    },
  ],
};
