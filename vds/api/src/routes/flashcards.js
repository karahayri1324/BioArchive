const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../models/db');
const { authenticate, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/flashcards - Flash kart setlerini listele
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { topic } = req.query;

    let whereClause = 'WHERE fs.is_public = true';
    const params = [];
    let paramIndex = 1;

    if (req.user) {
      whereClause += ` OR fs.created_by = $${paramIndex}`;
      params.push(req.user.id);
      paramIndex++;
    }

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
    const set = await query(
      'SELECT id, title, topic, is_public, created_by FROM flashcard_sets WHERE id = $1',
      [req.params.setId]
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
      [req.params.setId]
    );

    res.json({
      set: { id: s.id, title: s.title, topic: s.topic },
      cards: cards.rows,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/flashcards - Yeni flash kart seti olustur
router.post('/', authenticate, [
  body('title').trim().isLength({ min: 2, max: 100 }),
  body('topic').trim().isLength({ min: 2, max: 50 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('isPublic').optional().isBoolean(),
  body('cards').isArray({ min: 1, max: 100 }),
  body('cards.*.front').trim().isLength({ min: 1, max: 500 }),
  body('cards.*.back').trim().isLength({ min: 1, max: 1000 }),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Gecersiz veri.', details: errors.array() });
    }

    const { title, topic, description, isPublic = true, cards } = req.body;

    const setResult = await query(
      `INSERT INTO flashcard_sets (title, topic, description, is_public, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [title, topic, description || '', isPublic, req.user.id]
    );

    const setId = setResult.rows[0].id;

    // Kartlari ekle
    for (let i = 0; i < cards.length; i++) {
      await query(
        `INSERT INTO flashcards (set_id, front, back, sort_order) VALUES ($1, $2, $3, $4)`,
        [setId, cards[i].front, cards[i].back, i]
      );
    }

    res.status(201).json({
      message: 'Flash kart seti olusturuldu!',
      setId,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
