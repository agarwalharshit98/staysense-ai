const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  guestName: {
    type: String,
    required: [true, 'Guest name is required'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  text: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: 'neutral'
  },
  themes: [{
    type: String,
    enum: ['food', 'host', 'cleanliness', 'location', 'value']
  }],
  date: {
    type: Date,
    default: Date.now
  },
  response: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster searches
reviewSchema.index({ text: 'text', guestName: 'text' });
reviewSchema.index({ sentiment: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ themes: 1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
