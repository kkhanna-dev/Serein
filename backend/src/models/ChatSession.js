const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    role:      { type: String, enum: ['user', 'assistant'], required: true },
    content:   { type: String, required: true, maxlength: 10000 },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const chatSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title:    { type: String, default: 'New conversation', maxlength: 120 },
    messages: {
      type: [messageSchema],
      validate: {
        validator: (v) => v.length <= 100,
        message: 'Session cannot exceed 100 messages',
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('ChatSession', chatSessionSchema);
