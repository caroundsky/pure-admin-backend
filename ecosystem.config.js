module.exports = {
  apps : [{
    name      : 'myapp',
    script    : 'pnpm run start:prod',
    cwd: './',
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'development'
    },
    env_production : {
      NODE_ENV: 'production'
    },

    log_date_format: 'YYYY-MM-DD HH:mm Z',
    error_file: './logs/pmerr.log'
  }],
};
