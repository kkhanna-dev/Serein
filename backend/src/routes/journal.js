const express = require('express');
const { body, query, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const JournalEntry = require('../models/JournalEntry');
const MoodEntry = require('../models/MoodEntry');

const router = express.Router();

const MOOD_LABELS = {
  1: 'very_low',
  2: 'low',
  3: 'neutral',
  4: 'good',
  5: 'great',
};

// ── GET /api/journal ─────────────────────────────────────────────────────────
router.get(
  '/',
  auth,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
  ],
  async (req, res) => {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    try {
      const [entries, total] = await Promise.all([
        JournalEntry.find({ userId: req.user._id })
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        JournalEntry.countDocuments({ userId: req.user._id }),
      ]);

      res.json({ entries, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
      console.error('Journal fetch error:', err);
      res.status(500).json({ error: 'Failed to fetch entries' });
    }
  },
);

// ── POST /api/journal ────────────────────────────────────────────────────────
router.post(
  '/',
  auth,
  [
    body('content').trim().notEmpty().withMessage('Content is required').isLength({ max: 5000 }),
    body('mood').isInt({ min: 1, max: 5 }).withMessage('Mood must be 1–5'),
    body('tags').optional().isArray({ max: 10 }),
    body('tags.*').optional().trim().isLength({ max: 30 }),
    body('date').optional().isISO8601().toDate(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { content, mood, tags, date } = req.body;
    const entryDate = date ? new Date(date) : new Date();

    try {
      const entry = await JournalEntry.create({
        userId: req.user._id,
        content,
        mood,
        moodLabel: MOOD_LABELS[mood],
        tags: tags || [],
        date: entryDate,
      });

      // Mirror mood into the standalone mood log
      await MoodEntry.create({ userId: req.user._id, mood, date: entryDate });

      res.status(201).json({ entry });
    } catch (err) {
      console.error('Journal create error:', err);
      res.status(500).json({ error: 'Failed to create entry' });
    }
  },
);

// ── DELETE /api/journal/:id ──────────────────────────────────────────────────
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    console.error('Journal delete error:', err);
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

module.exports = router;
