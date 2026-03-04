const config = require('../config');

function errorHandler(err, req, res, _next) {
  const requestId = req.id || 'unknown';

  // Production'da stack trace logla ama kullaniciya gosterme
  if (config.isProduction) {
    console.error(`[ERROR] [${requestId}] ${req.method} ${req.originalUrl}:`, err.message);
  } else {
    console.error(`[ERROR] [${requestId}]`, err.stack || err.message);
  }

  // JSON parse hatasi
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Gecersiz JSON formati.' });
  }

  // Dosya boyutu limiti
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Istek boyutu cok buyuk.' });
  }

  // PostgreSQL hatalari
  if (err.code === '23505') {
    return res.status(409).json({ error: 'Bu kayit zaten mevcut.' });
  }

  if (err.code === '23503') {
    return res.status(400).json({ error: 'Iliskili kayit bulunamadi.' });
  }

  if (err.code === '23502') {
    return res.status(400).json({ error: 'Zorunlu alan eksik.' });
  }

  // Multer dosya yukleme hatalari
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'Dosya boyutu cok buyuk.' });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Beklenmeyen dosya alani.' });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode === 500 && config.isProduction
    ? 'Sunucu hatasi olustu.'
    : err.message;

  res.status(statusCode).json({
    error: message,
    ...(req.id && { requestId }),
    ...(!config.isProduction && { stack: err.stack }),
  });
}

module.exports = errorHandler;
