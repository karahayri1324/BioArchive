const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
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

// ---- Guvenlik Middleware ----
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ---- Genel Middleware ----
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(rateLimiter);

// ---- Statik Dosyalar (Yuklenen Dosyalar) ----
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ---- Saglik Kontrolu ----
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'BioArchive API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
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

// ---- Sunucuyu Baslat ----
async function startServer() {
  try {
    await testConnection();
    console.log('[DB] PostgreSQL baglantisi basarili');

    app.listen(config.port, '0.0.0.0', () => {
      console.log(`[SERVER] BioArchive API calisiyor`);
      console.log(`[SERVER] Port: ${config.port}`);
      console.log(`[SERVER] Ortam: ${config.nodeEnv}`);
      console.log(`[SERVER] URL: ${config.apiUrl}`);
    });
  } catch (err) {
    console.error('[SERVER] Baslama hatasi:', err.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;
