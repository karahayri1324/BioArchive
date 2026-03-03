// PM2 Yapilandirma Dosyasi
module.exports = {
  apps: [{
    name: 'bioarchive-api',
    script: 'src/index.js',
    cwd: '/var/www/bioarchive/vds/api',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
    },
    error_file: '/var/log/pm2/bioarchive-error.log',
    out_file: '/var/log/pm2/bioarchive-out.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }],
};
