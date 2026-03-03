const jwt = require('jsonwebtoken');
const config = require('../config');
const { query } = require('../models/db');

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Yetkilendirme basarisiz. Token gerekli.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const result = await query('SELECT id, username, email, display_name, avatar_color FROM users WHERE id = $1', [decoded.userId]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Kullanici bulunamadi.' });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token suresi dolmus.', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Gecersiz token.' });
  }
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    query('SELECT id, username, email, display_name, avatar_color FROM users WHERE id = $1', [decoded.userId])
      .then(result => {
        req.user = result.rows[0] || null;
        next();
      })
      .catch(() => {
        req.user = null;
        next();
      });
  } catch {
    req.user = null;
    next();
  }
}

module.exports = { authenticate, optionalAuth };
