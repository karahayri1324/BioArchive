const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../models/db');
const { authenticate } = require('../middleware/auth');
const { chatLimiter } = require('../middleware/rateLimit');
const aiService = require('../services/aiService');

const router = express.Router();

// POST /api/chat/message - AI'a mesaj gonder
router.post('/message', authenticate, chatLimiter, [
  body('message').trim().isLength({ min: 1, max: 5000 }),
  body('conversationId').optional().isUUID(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Gecersiz mesaj.' });
    }

    const { message, conversationId } = req.body;
    let convId = conversationId;

    // Yeni konusma olustur veya mevcut konusmayi kontrol et
    if (!convId) {
      const result = await query(
        `INSERT INTO conversations (user_id, title) VALUES ($1, $2) RETURNING id`,
        [req.user.id, message.substring(0, 100)]
      );
      convId = result.rows[0].id;
    } else {
      const conv = await query(
        'SELECT id FROM conversations WHERE id = $1 AND user_id = $2',
        [convId, req.user.id]
      );
      if (conv.rows.length === 0) {
        return res.status(404).json({ error: 'Konusma bulunamadi.' });
      }
    }

    // Kullanici mesajini kaydet
    await query(
      `INSERT INTO chat_messages (conversation_id, role, content) VALUES ($1, 'user', $2)`,
      [convId, message]
    );

    // Konusma gecmisini al (son 20 mesaj)
    const history = await query(
      `SELECT role, content FROM chat_messages
       WHERE conversation_id = $1
       ORDER BY created_at ASC
       LIMIT 20`,
      [convId]
    );

    // AI yaniti al
    const aiResponse = await aiService.generateResponse(message, history.rows);

    // AI yanitini kaydet
    await query(
      `INSERT INTO chat_messages (conversation_id, role, content) VALUES ($1, 'assistant', $2)`,
      [convId, aiResponse]
    );

    res.json({
      conversationId: convId,
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/chat/conversations - Kullanicinin konusmalarini listele
router.get('/conversations', authenticate, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT c.id, c.title, c.created_at, c.updated_at,
              (SELECT COUNT(*) FROM chat_messages WHERE conversation_id = c.id) as message_count
       FROM conversations c
       WHERE c.user_id = $1
       ORDER BY c.updated_at DESC
       LIMIT 50`,
      [req.user.id]
    );

    res.json({ conversations: result.rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/chat/conversations/:id - Konusma mesajlarini getir
router.get('/conversations/:id', authenticate, async (req, res, next) => {
  try {
    const conv = await query(
      'SELECT id, title FROM conversations WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (conv.rows.length === 0) {
      return res.status(404).json({ error: 'Konusma bulunamadi.' });
    }

    const messages = await query(
      `SELECT id, role, content, created_at FROM chat_messages
       WHERE conversation_id = $1
       ORDER BY created_at ASC`,
      [req.params.id]
    );

    res.json({
      conversation: conv.rows[0],
      messages: messages.rows,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/chat/conversations/:id - Konusmayi sil
router.delete('/conversations/:id', authenticate, async (req, res, next) => {
  try {
    const result = await query(
      'DELETE FROM conversations WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Konusma bulunamadi.' });
    }

    res.json({ message: 'Konusma silindi.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
