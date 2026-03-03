const config = require('../config');

function errorHandler(err, req, res, _next) {
  console.error('[ERROR]', err.stack || err.message);

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Gecersiz JSON formati.' });
  }

  if (err.code === '23505') {
    return res.status(409).json({ error: 'Bu kayit zaten mevcut.' });
  }

  if (err.code === '23503') {
    return res.status(400).json({ error: 'Iliskili kayit bulunamadi.' });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 && config.nodeEnv === 'production'
    ? 'Sunucu hatasi olustu.'
    : err.message;

  res.status(statusCode).json({
    error: message,
    ...(config.nodeEnv !== 'production' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
