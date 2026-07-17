module.exports = {
  apps: [{
    name: 'portfolio-backend',
    script: 'server.js',
    instances: 1,
    exec_mode: 'fork', // Fork mode is memory efficient for 1GB RAM instances
    watch: false,
    max_memory_restart: '200M', // Restart process if it leaks beyond 200MB to protect VM
    env: {
      NODE_ENV: 'development',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: 'logs/pm2-error.log',
    out_file: 'logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
};
