const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, pool } = require('../models/db');
const { authenticate, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/flashcards - Flash kart setlerini listele
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { topic } = req.query;

    // WHERE clause'u dogru oncelik ile olustur (OR/AND precedence fix)
    let whereClause = 'WHERE (fs.is_public = true';
    const params = [];
    let paramIndex = 1;

    if (req.user) {
      whereClause += ` OR fs.created_by = $${paramIndex}`;
      params.push(req.user.id);
      paramIndex++;
    }

    whereClause += ')'; // Parantezi kapat

    if (topic) {
      whereClause += ` AND fs.topic = $${paramIndex}`;
      params.push(topic);
      paramIndex++;
    }

    const result = await query(
      `SELECT fs.id, fs.title, fs.topic, fs.description, fs.is_public,
              fs.created_at,
              u.display_name as creator_name,
              (SELECT COUNT(*) FROM flashcards fc WHERE fc.set_id = fs.id) as card_count
       FROM flashcard_sets fs
       JOIN users u ON fs.created_by = u.id
       ${whereClause}
       ORDER BY fs.created_at DESC`,
      params
    );

    res.json({ sets: result.rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/flashcards/:setId/cards - Bir setin kartlarini getir
router.get('/:setId/cards', optionalAuth, async (req, res, next) => {
  try {
    const setId = parseInt(req.params.setId);
    if (!Number.isFinite(setId) || setId < 1) {
      return res.status(400).json({ error: 'Gecersiz set ID.' });
    }

    const set = await query(
      'SELECT id, title, topic, is_public, created_by FROM flashcard_sets WHERE id = $1',
      [setId]
    );

    if (set.rows.length === 0) {
      return res.status(404).json({ error: 'Kart seti bulunamadi.' });
    }

    const s = set.rows[0];
    if (!s.is_public && (!req.user || req.user.id !== s.created_by)) {
      return res.status(403).json({ error: 'Bu kart setine erisim yetkiniz yok.' });
    }

    const cards = await query(
      `SELECT id, front, back, sort_order FROM flashcards
       WHERE set_id = $1
       ORDER BY sort_order ASC`,
      [setId]
    );

    res.json({
      set: { id: s.id, title: s.title, topic: s.topic },
      cards: cards.rows,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/flashcards - Yeni flash kart seti olustur (transaction ile)
router.post('/', authenticate, [
  body('title').trim().isLength({ min: 2, max: 100 }),
  body('topic').trim().isLength({ min: 2, max: 50 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('isPublic').optional().isBoolean(),
  body('cards').isArray({ min: 1, max: 100 }),
  body('cards.*.front').trim().isLength({ min: 1, max: 500 }),
  body('cards.*.back').trim().isLength({ min: 1, max: 1000 }),
], async (req, res, next) => {
  const client = await pool.connect();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      client.release();
      return res.status(400).json({ error: 'Gecersiz veri.', details: errors.array() });
    }

    const { title, topic, description, isPublic = true, cards } = req.body;

    await client.query('BEGIN');

    const setResult = await client.query(
      `INSERT INTO flashcard_sets (title, topic, description, is_public, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [title, topic, description || '', isPublic, req.user.id]
    );

    const setId = setResult.rows[0].id;

    // Kartlari toplu olarak ekle (batch insert)
    if (cards.length > 0) {
      const values = [];
      const insertParams = [];
      for (let i = 0; i < cards.length; i++) {
        const base = i * 4;
        values.push(`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`);
        insertParams.push(setId, cards[i].front, cards[i].back, i);
      }

      await client.query(
        `INSERT INTO flashcards (set_id, front, back, sort_order) VALUES ${values.join(', ')}`,
        insertParams
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Flash kart seti olusturuldu!',
      setId,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

module.exports = router;
