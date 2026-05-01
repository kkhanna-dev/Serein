const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    mood: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    moodLabel: {
      type: String,
      enum: ['very_low', 'low', 'neutral', 'good', 'great'],
      required: true,
    },
    tags: [{ type: String, trim: true, maxlength: 30 }],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

journalEntrySchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
