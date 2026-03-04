require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

// Production ortaminda kritik degiskenlerin varligini kontrol et
function requireEnv(name) {
  const value = process.env[name];
  if (!value && isProduction) {
    console.error(`[CONFIG] KRITIK: ${name} ortam degiskeni production'da zorunludur!`);
    process.exit(1);
  }
  return value;
}

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  isProduction,

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'bioarchive',
    user: process.env.DB_USER || 'bioarchive_user',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  },

  jwt: {
    secret: requireEnv('JWT_SECRET') || 'dev-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: requireEnv('JWT_REFRESH_SECRET') || 'dev-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  ai: {
    provider: process.env.AI_PROVIDER || 'openai',
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
    },
  },

  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
      : ['http://localhost:5500', 'http://localhost:8080'],
  },

  upload: {
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE, 10) || 10 * 1024 * 1024,
    dir: process.env.UPLOAD_DIR || './uploads',
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },
};

// Production'da default JWT secret kullanilmasin
if (isProduction) {
  if (config.jwt.secret === 'dev-secret-change-in-production') {
    console.error('[CONFIG] KRITIK: Production ortaminda default JWT_SECRET kullanilamaz!');
    process.exit(1);
  }
  if (config.jwt.refreshSecret === 'dev-refresh-secret') {
    console.error('[CONFIG] KRITIK: Production ortaminda default JWT_REFRESH_SECRET kullanilamaz!');
    process.exit(1);
  }
  requireEnv('DB_PASSWORD');
  requireEnv('CORS_ORIGIN');
}

module.exports = config;
