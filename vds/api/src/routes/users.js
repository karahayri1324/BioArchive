const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../models/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// ONEMLI: Sabit path'ler dynamic param'lardan once tanimlanmali!
// Yoksa /me/bookmarks istegi /:username route'una duser.

// PUT /api/users/profile - Profil guncelle
router.put('/profile', authenticate, [
  body('displayName').optional().trim().isLength({ min: 2, max: 50 }),
  body('bio').optional().trim().isLength({ max: 300 }),
  body('avatarColor').optional().matches(/^#[0-9A-Fa-f]{6}$/),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Gecersiz veri.', details: errors.array() });
    }

    const { displayName, bio, avatarColor } = req.body;
    const updates = [];
    const params = [];
    let idx = 1;

    if (displayName) { updates.push(`display_name = $${idx++}`); params.push(displayName); }
    if (bio !== undefined) { updates.push(`bio = $${idx++}`); params.push(bio); }
    if (avatarColor) { updates.push(`avatar_color = $${idx++}`); params.push(avatarColor); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Guncellenecek alan belirtilmedi.' });
    }

    params.push(req.user.id);
    await query(`UPDATE users SET ${updates.join(', ')} WHERE id = $${idx}`, params);

    res.json({ message: 'Profil guncellendi.' });
  } catch (err) {
    next(err);
  }
});

// GET /api/users/me/bookmarks - Kaydedilen paylasimlari getir
router.get('/me/bookmarks', authenticate, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT p.id, p.title, p.body, p.category, p.tags, p.likes_count,
              p.created_at,
              u.display_name as author_name, u.username as author_username,
              u.avatar_color as author_color,
              (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as comment_count
       FROM bookmarks b
       JOIN posts p ON b.post_id = p.id
       JOIN users u ON p.author_id = u.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );

    res.json({
      bookmarks: result.rows.map(p => ({
        id: p.id,
        title: p.title,
        body: p.body,
        category: p.category,
        tags: p.tags,
        likesCount: parseInt(p.likes_count),
        commentCount: parseInt(p.comment_count),
        createdAt: p.created_at,
        author: {
          username: p.author_username,
          displayName: p.author_name,
          avatarColor: p.author_color,
          initials: p.author_name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase(),
        },
      })),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/users/:username - Kullanici profili
router.get('/:username', async (req, res, next) => {
  try {
    const result = await query(
      `SELECT u.id, u.username, u.display_name, u.avatar_color, u.bio, u.created_at,
              (SELECT COUNT(*) FROM posts WHERE author_id = u.id) as post_count,
              (SELECT COUNT(*) FROM post_likes pl JOIN posts p ON pl.post_id = p.id WHERE p.author_id = u.id) as total_likes
       FROM users u
       WHERE u.username = $1`,
      [req.params.username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanici bulunamadi.' });
    }

    const user = result.rows[0];
    res.json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.display_name,
        avatarColor: user.avatar_color,
        bio: user.bio,
        postCount: parseInt(user.post_count),
        totalLikes: parseInt(user.total_likes),
        initials: user.display_name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase(),
        memberSince: user.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/users/:username/posts - Kullanicinin paylasimlari
router.get('/:username/posts', async (req, res, next) => {
  try {
    const userResult = await query('SELECT id FROM users WHERE username = $1', [req.params.username]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanici bulunamadi.' });
    }

    const userId = userResult.rows[0].id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT p.id, p.title, p.body, p.category, p.tags, p.likes_count,
              p.created_at,
              (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as comment_count
       FROM posts p
       WHERE p.author_id = $1
       ORDER BY p.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    res.json({ posts: result.rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
