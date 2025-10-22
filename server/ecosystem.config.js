module.exports = {
  apps: [
    {
      name: 'pet-server',
      script: 'dist/src/main.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        PORT: 7000,
      },
    },
  ],
};
