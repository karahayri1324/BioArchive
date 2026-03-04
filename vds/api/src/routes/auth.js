const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { query } = require('../models/db');
const config = require('../config');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// Token olusturma
function generateTokens(userId) {
  const accessToken = jwt.sign({ userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  const refreshToken = jwt.sign({ userId }, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn });
  return { accessToken, refreshToken };
}

// POST /api/auth/register - Kayit ol
router.post('/register', authLimiter, [
  body('username').trim().isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
  body('email').isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Sifre en az 8 karakter olmalidir.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Sifre en az bir buyuk harf, bir kucuk harf ve bir rakam icermelidir.'),
  body('displayName').trim().isLength({ min: 2, max: 50 }),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Gecersiz veri.', details: errors.array() });
    }

    const { username, email, password, displayName } = req.body;

    // Kullanici kontrolu
    const existing = await query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Bu kullanici adi veya e-posta zaten kullaniliyor.' });
    }

    // Sifre hashleme
    const passwordHash = await bcrypt.hash(password, 12);

    // Rastgele avatar rengi
    const colors = ['#4DBAB0', '#8B6CC1', '#4A90D9', '#D94F7A', '#E8853D', '#3DAE85'];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    // Kullanici olustur
    const result = await query(
      `INSERT INTO users (username, email, password_hash, display_name, avatar_color)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, email, display_name, avatar_color, created_at`,
      [username, email, passwordHash, displayName, avatarColor]
    );

    const user = result.rows[0];
    const tokens = generateTokens(user.id);

    res.status(201).json({
      message: 'Kayit basarili!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.display_name,
        avatarColor: user.avatar_color,
      },
      ...tokens,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login - Giris yap
router.post('/login', authLimiter, [
  body('login').trim().notEmpty(),
  body('password').notEmpty(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Kullanici adi/e-posta ve sifre gerekli.' });
    }

    const { login, password } = req.body;

    // Kullanici bul (username veya email ile)
    const result = await query(
      'SELECT id, username, email, display_name, avatar_color, password_hash FROM users WHERE username = $1 OR email = $1',
      [login]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Gecersiz kullanici adi veya sifre.' });
    }

    const user = result.rows[0];

    // Sifre kontrolu
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Gecersiz kullanici adi veya sifre.' });
    }

    const tokens = generateTokens(user.id);

    res.json({
      message: 'Giris basarili!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.display_name,
        avatarColor: user.avatar_color,
      },
      ...tokens,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/refresh - Token yenile
router.post('/refresh', authLimiter, [
  body('refreshToken').notEmpty(),
], async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    const result = await query('SELECT id FROM users WHERE id = $1', [decoded.userId]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Gecersiz token.' });
    }

    const tokens = generateTokens(decoded.userId);
    res.json(tokens);
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Gecersiz veya suresi dolmus token.' });
    }
    next(err);
  }
});

// GET /api/auth/me - Mevcut kullanici bilgisi
router.get('/me', authenticate, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      displayName: req.user.display_name,
      avatarColor: req.user.avatar_color,
    },
  });
});

module.exports = router;
