const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    mood: { type: Number, required: true, min: 1, max: 5 },
    note: { type: String, maxlength: 200, default: '' },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

moodEntrySchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('MoodEntry', moodEntrySchema);
