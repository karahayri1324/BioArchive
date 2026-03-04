const rateLimit = require('express-rate-limit');
const config = require('../config');

// Genel API limiter
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    error: 'Cok fazla istek gonderdiniz. Lutfen biraz bekleyin.',
    retryAfter: Math.ceil(config.rateLimit.windowMs / 1000),
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Proxy arkasinda gercek IP'yi kullan
  keyGenerator: (req) => req.ip,
});

// AI chat limiter - dakikada 10 mesaj
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    error: 'AI sohbet limiti asildi. Dakikada en fazla 10 mesaj gonderebilirsiniz.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
});

// Auth limiter - brute force korunmasi
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,    // 20'den 10'a dusuruldu - brute force korunmasi icin
  message: {
    error: 'Cok fazla giris denemesi. 15 dakika sonra tekrar deneyin.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  skipSuccessfulRequests: true,  // Basarili istekleri sayma
});

module.exports = limiter;
module.exports.chatLimiter = chatLimiter;
module.exports.authLimiter = authLimiter;
