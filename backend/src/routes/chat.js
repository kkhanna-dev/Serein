const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const ChatSession = require('../models/ChatSession');
const { getChatResponse } = require('../services/claude');

const router = express.Router();

// ── POST /api/chat/message ───────────────────────────────────────────────────
router.post(
  '/message',
  auth,
  [
    body('message').trim().notEmpty().withMessage('Message cannot be empty').isLength({ max: 2000 }),
    body('sessionId').optional().isMongoId(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { message, sessionId } = req.body;

    try {
      // Resolve or create session
      let session;
      if (sessionId) {
        session = await ChatSession.findOne({ _id: sessionId, userId: req.user._id });
      }
      if (!session) {
        session = await ChatSession.create({ userId: req.user._id, messages: [] });
      }

      // Build history for Claude (last 20 turns to keep costs down)
      const history = session.messages.slice(-20);
      const messagesForAPI = [...history, { role: 'user', content: message }];

      const aiResponse = await getChatResponse(messagesForAPI, req.user);

      // Persist both turns
      session.messages.push(
        { role: 'user',      content: message },
        { role: 'assistant', content: aiResponse },
      );

      // Auto-title from first message
      if (session.messages.length <= 2) {
        session.title = message.slice(0, 60) + (message.length > 60 ? '…' : '');
      }

      await session.save();

      res.json({ response: aiResponse, sessionId: session._id });
    } catch (err) {
      console.error('Chat error:', err);
      res.status(500).json({ error: 'Failed to get a response. Please try again.' });
    }
  },
);

// ── GET /api/chat/sessions ───────────────────────────────────────────────────
router.get('/sessions', auth, async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userId: req.user._id })
      .select('title createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .limit(20)
      .lean();

    res.json({ sessions });
  } catch (err) {
    console.error('Sessions fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// ── GET /api/chat/sessions/:id ───────────────────────────────────────────────
router.get('/sessions/:id', auth, async (req, res) => {
  try {
    const session = await ChatSession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json({ session });
  } catch (err) {
    console.error('Session fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

module.exports = router;
