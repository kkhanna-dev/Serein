const express = require('express');
const { body, query, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const MoodEntry = require('../models/MoodEntry');

const router = express.Router();

// ── GET /api/mood/history ────────────────────────────────────────────────────
router.get(
  '/history',
  auth,
  [query('days').optional().isInt({ min: 1, max: 90 })],
  async (req, res) => {
    const days  = Math.min(90, parseInt(req.query.days) || 30);
    const since = new Date();
    since.setDate(since.getDate() - days);

    try {
      const entries = await MoodEntry.find({
        userId: req.user._id,
        date: { $gte: since },
      })
        .sort({ date: 1 })
        .lean();

      res.json({ entries });
    } catch (err) {
      console.error('Mood history error:', err);
      res.status(500).json({ error: 'Failed to fetch mood history' });
    }
  },
);

// ── POST /api/mood ───────────────────────────────────────────────────────────
router.post(
  '/',
  auth,
  [
    body('mood').isInt({ min: 1, max: 5 }).withMessage('Mood must be 1–5'),
    body('note').optional().trim().isLength({ max: 200 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { mood, note } = req.body;

    try {
      const entry = await MoodEntry.create({ userId: req.user._id, mood, note });
      res.status(201).json({ entry });
    } catch (err) {
      console.error('Mood log error:', err);
      res.status(500).json({ error: 'Failed to log mood' });
    }
  },
);

module.exports = router;
