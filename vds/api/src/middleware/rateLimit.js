const rateLimit = require('express-rate-limit');
const config = require('../config');

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    error: 'Cok fazla istek gonderdiniz. Lutfen biraz bekleyin.',
    retryAfter: Math.ceil(config.rateLimit.windowMs / 1000),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    error: 'AI sohbet limiti asildi. Dakikada en fazla 10 mesaj gonderebilirsiniz.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    error: 'Cok fazla giris denemesi. 15 dakika sonra tekrar deneyin.',
  },
});

module.exports = limiter;
module.exports.chatLimiter = chatLimiter;
module.exports.authLimiter = authLimiter;
