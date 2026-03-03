const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../models/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/comments - Yorum ekle
router.post('/', authenticate, [
  body('postId').isInt({ min: 1 }),
  body('content').trim().isLength({ min: 1, max: 2000 }),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Gecersiz veri.', details: errors.array() });
    }

    const { postId, content } = req.body;

    // Post var mi kontrol et
    const post = await query('SELECT id FROM posts WHERE id = $1', [postId]);
    if (post.rows.length === 0) {
      return res.status(404).json({ error: 'Paylasim bulunamadi.' });
    }

    const result = await query(
      `INSERT INTO comments (post_id, author_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, content, created_at`,
      [postId, req.user.id, content]
    );

    const comment = result.rows[0];

    res.status(201).json({
      message: 'Yorum eklendi!',
      comment: {
        id: comment.id,
        content: comment.content,
        createdAt: comment.created_at,
        author: {
          id: req.user.id,
          username: req.user.username,
          displayName: req.user.display_name,
          avatarColor: req.user.avatar_color,
          initials: req.user.display_name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase(),
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/comments/:id - Yorum sil
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const result = await query(
      'DELETE FROM comments WHERE id = $1 AND author_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Yorum bulunamadi veya yetkiniz yok.' });
    }

    res.json({ message: 'Yorum silindi.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
