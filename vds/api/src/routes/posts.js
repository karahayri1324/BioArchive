const express = require('express');
const { body, param, query: checkQuery, validationResult } = require('express-validator');
const { query } = require('../models/db');
const { authenticate, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/posts - Paylasimlari listele
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { category, page = 1, limit = 20, sort = 'newest' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (category && category !== 'all') {
      whereClause += ` AND p.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    const orderBy = sort === 'popular' ? 'p.likes_count DESC' : 'p.created_at DESC';

    params.push(parseInt(limit), offset);

    const result = await query(
      `SELECT p.id, p.title, p.body, p.category, p.tags, p.likes_count,
              p.created_at, p.updated_at,
              u.id as author_id, u.username as author_username,
              u.display_name as author_name, u.avatar_color as author_color,
              (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as comment_count
              ${req.user ? `,
              EXISTS(SELECT 1 FROM post_likes pl WHERE pl.post_id = p.id AND pl.user_id = ${paramIndex + 2}) as liked,
              EXISTS(SELECT 1 FROM bookmarks b WHERE b.post_id = p.id AND b.user_id = ${paramIndex + 2}) as bookmarked`
              : ', false as liked, false as bookmarked'}
       FROM posts p
       JOIN users u ON p.author_id = u.id
       ${whereClause}
       ORDER BY ${orderBy}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      req.user ? [...params, req.user.id] : params
    );

    const countResult = await query(
      `SELECT COUNT(*) FROM posts p ${whereClause}`,
      category && category !== 'all' ? [category] : []
    );

    res.json({
      posts: result.rows.map(p => ({
        id: p.id,
        title: p.title,
        body: p.body,
        category: p.category,
        tags: p.tags,
        likesCount: parseInt(p.likes_count),
        commentCount: parseInt(p.comment_count),
        liked: p.liked,
        bookmarked: p.bookmarked,
        createdAt: p.created_at,
        author: {
          id: p.author_id,
          username: p.author_username,
          displayName: p.author_name,
          avatarColor: p.author_color,
          initials: p.author_name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase(),
        },
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count),
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/posts/:id - Tek paylasim getir
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT p.id, p.title, p.body, p.category, p.tags, p.likes_count,
              p.created_at, p.updated_at,
              u.id as author_id, u.username as author_username,
              u.display_name as author_name, u.avatar_color as author_color
              ${req.user ? `,
              EXISTS(SELECT 1 FROM post_likes pl WHERE pl.post_id = p.id AND pl.user_id = $2) as liked,
              EXISTS(SELECT 1 FROM bookmarks b WHERE b.post_id = p.id AND b.user_id = $2) as bookmarked`
              : ', false as liked, false as bookmarked'}
       FROM posts p
       JOIN users u ON p.author_id = u.id
       WHERE p.id = $1`,
      req.user ? [req.params.id, req.user.id] : [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Paylasim bulunamadi.' });
    }

    // Yorumlari da getir
    const comments = await query(
      `SELECT c.id, c.content, c.created_at,
              u.id as author_id, u.username as author_username,
              u.display_name as author_name, u.avatar_color as author_color
       FROM comments c
       JOIN users u ON c.author_id = u.id
       WHERE c.post_id = $1
       ORDER BY c.created_at ASC`,
      [req.params.id]
    );

    const p = result.rows[0];
    res.json({
      post: {
        id: p.id,
        title: p.title,
        body: p.body,
        category: p.category,
        tags: p.tags,
        likesCount: parseInt(p.likes_count),
        liked: p.liked,
        bookmarked: p.bookmarked,
        createdAt: p.created_at,
        author: {
          id: p.author_id,
          username: p.author_username,
          displayName: p.author_name,
          avatarColor: p.author_color,
          initials: p.author_name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase(),
        },
        comments: comments.rows.map(c => ({
          id: c.id,
          content: c.content,
          createdAt: c.created_at,
          author: {
            id: c.author_id,
            username: c.author_username,
            displayName: c.author_name,
            avatarColor: c.author_color,
            initials: c.author_name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase(),
          },
        })),
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/posts - Yeni paylasim olustur
router.post('/', authenticate, [
  body('title').trim().isLength({ min: 3, max: 200 }),
  body('body').trim().isLength({ min: 10, max: 10000 }),
  body('category').isIn(['article', 'research', 'note', 'question']),
  body('tags').isArray({ max: 5 }),
  body('tags.*').trim().isLength({ min: 1, max: 30 }),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Gecersiz veri.', details: errors.array() });
    }

    const { title, body: postBody, category, tags } = req.body;

    const result = await query(
      `INSERT INTO posts (author_id, title, body, category, tags)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, body, category, tags, likes_count, created_at`,
      [req.user.id, title, postBody, category, JSON.stringify(tags)]
    );

    const post = result.rows[0];

    res.status(201).json({
      message: 'Paylasim olusturuldu!',
      post: {
        id: post.id,
        title: post.title,
        body: post.body,
        category: post.category,
        tags: post.tags,
        likesCount: 0,
        createdAt: post.created_at,
        author: {
          id: req.user.id,
          username: req.user.username,
          displayName: req.user.display_name,
          avatarColor: req.user.avatar_color,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/posts/:id - Paylasim guncelle
router.put('/:id', authenticate, [
  body('title').optional().trim().isLength({ min: 3, max: 200 }),
  body('body').optional().trim().isLength({ min: 10, max: 10000 }),
  body('tags').optional().isArray({ max: 5 }),
], async (req, res, next) => {
  try {
    const post = await query('SELECT author_id FROM posts WHERE id = $1', [req.params.id]);
    if (post.rows.length === 0) {
      return res.status(404).json({ error: 'Paylasim bulunamadi.' });
    }
    if (post.rows[0].author_id !== req.user.id) {
      return res.status(403).json({ error: 'Bu paylasimi duzenleme yetkiniz yok.' });
    }

    const { title, body: postBody, tags } = req.body;
    const updates = [];
    const params = [];
    let idx = 1;

    if (title) { updates.push(`title = $${idx++}`); params.push(title); }
    if (postBody) { updates.push(`body = $${idx++}`); params.push(postBody); }
    if (tags) { updates.push(`tags = $${idx++}`); params.push(JSON.stringify(tags)); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Guncellenecek alan belirtilmedi.' });
    }

    updates.push(`updated_at = NOW()`);
    params.push(req.params.id);

    await query(
      `UPDATE posts SET ${updates.join(', ')} WHERE id = $${idx}`,
      params
    );

    res.json({ message: 'Paylasim guncellendi.' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/posts/:id - Paylasim sil
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const result = await query(
      'DELETE FROM posts WHERE id = $1 AND author_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Paylasim bulunamadi veya yetkiniz yok.' });
    }

    res.json({ message: 'Paylasim silindi.' });
  } catch (err) {
    next(err);
  }
});

// POST /api/posts/:id/like - Begeni toggle
router.post('/:id/like', authenticate, async (req, res, next) => {
  try {
    const existing = await query(
      'SELECT id FROM post_likes WHERE post_id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (existing.rows.length > 0) {
      // Begeniyi kaldir
      await query('DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2', [req.params.id, req.user.id]);
      await query('UPDATE posts SET likes_count = likes_count - 1 WHERE id = $1', [req.params.id]);
      res.json({ liked: false });
    } else {
      // Begen
      await query('INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)', [req.params.id, req.user.id]);
      await query('UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1', [req.params.id]);
      res.json({ liked: true });
    }
  } catch (err) {
    next(err);
  }
});

// POST /api/posts/:id/bookmark - Kaydet toggle
router.post('/:id/bookmark', authenticate, async (req, res, next) => {
  try {
    const existing = await query(
      'SELECT id FROM bookmarks WHERE post_id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (existing.rows.length > 0) {
      await query('DELETE FROM bookmarks WHERE post_id = $1 AND user_id = $2', [req.params.id, req.user.id]);
      res.json({ bookmarked: false });
    } else {
      await query('INSERT INTO bookmarks (post_id, user_id) VALUES ($1, $2)', [req.params.id, req.user.id]);
      res.json({ bookmarked: true });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
