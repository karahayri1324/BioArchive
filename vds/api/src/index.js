const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const crypto = require('crypto');
const config = require('./config');
const { pool, testConnection } = require('./models/db');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimit');

// Route imports
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');
const flashcardsRoutes = require('./routes/flashcards');
const usersRoutes = require('./routes/users');

const app = express();

// ---- Trust proxy (nginx arkasinda) ----
app.set('trust proxy', 1);

// ---- Request ID Middleware ----
app.use((req, _res, next) => {
  req.id = crypto.randomUUID();
  next();
});

// ---- Guvenlik Middleware ----
app.use(helmet({
  contentSecurityPolicy: config.isProduction ? undefined : false,
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ---- Genel Middleware ----
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(config.isProduction ? 'combined' : 'dev'));
app.use(rateLimiter);

// ---- Statik Dosyalar (Yuklenen Dosyalar) ----
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), {
  maxAge: config.isProduction ? '7d' : 0,
  dotfiles: 'deny',
}));

// ---- Saglik Kontrolu ----
app.get('/api/health', async (_req, res) => {
  let dbStatus = 'ok';
  try {
    await pool.query('SELECT 1');
  } catch {
    dbStatus = 'error';
  }

  const status = dbStatus === 'ok' ? 'ok' : 'degraded';
  const httpCode = status === 'ok' ? 200 : 503;

  res.status(httpCode).json({
    status,
    service: 'BioArchive API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: dbStatus,
  });
});

// ---- API Route'lari ----
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/flashcards', flashcardsRoutes);
app.use('/api/users', usersRoutes);

// ---- 404 Handler ----
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint bulunamadi',
    path: req.originalUrl,
    method: req.method,
  });
});

// ---- Hata Yakalama ----
app.use(errorHandler);

// ---- Graceful Shutdown ----
let server;
const SHUTDOWN_TIMEOUT = 10000;

async function gracefulShutdown(signal) {
  console.log(`\n[SERVER] ${signal} sinyali alindi, kapatiliyor...`);

  if (server) {
    server.close(() => {
      console.log('[SERVER] HTTP sunucusu kapatildi');
    });
  }

  try {
    await pool.end();
    console.log('[DB] Veritabani baglantilari kapatildi');
  } catch (err) {
    console.error('[DB] Kapatma hatasi:', err.message);
  }

  setTimeout(() => {
    console.error('[SERVER] Graceful shutdown zaman asimi, zorla kapatiliyor');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT);

  process.exit(0);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ---- Yakalanmamis Hata Handler'lari ----
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Yakalanmamis istisna:', err);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Islenmemis promise rejection:', reason);
});

// ---- Sunucuyu Baslat ----
async function startServer() {
  try {
    await testConnection();
    console.log('[DB] PostgreSQL baglantisi basarili');

    server = app.listen(config.port, '0.0.0.0', () => {
      console.log(`[SERVER] BioArchive API calisiyor`);
      console.log(`[SERVER] Port: ${config.port}`);
      console.log(`[SERVER] Ortam: ${config.nodeEnv}`);
      console.log(`[SERVER] URL: ${config.apiUrl}`);
    });

    // Sunucu timeout ayarlari
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;
  } catch (err) {
    console.error('[SERVER] Baslama hatasi:', err.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;
