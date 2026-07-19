const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const Review = require('./models/Review');
const { findByEmail, createUser, findById } = require('./models/User');
const { generateAiResponse } = require('./services/aiService');

const app = express();
const PORT = process.env.PORT || 5000;

const fallbackReviews = [
  {
    _id: 'demo-1',
    guestName: 'John Smith',
    rating: 5,
    text: 'Amazing stay! The host was incredibly friendly and the location was perfect.',
    sentiment: 'positive',
    themes: ['host', 'location'],
    date: new Date('2024-01-15'),
    response: null
  },
  {
    _id: 'demo-2',
    guestName: 'Sarah Johnson',
    rating: 4,
    text: 'Great experience overall. The place was clean but the WiFi was a bit slow.',
    sentiment: 'positive',
    themes: ['cleanliness', 'value'],
    date: new Date('2024-01-20'),
    response: null
  },
  {
    _id: 'demo-3',
    guestName: 'Mike Wilson',
    rating: 2,
    text: 'Disappointed with the cleanliness. Found dust in corners and bathroom needed attention.',
    sentiment: 'negative',
    themes: ['cleanliness'],
    date: new Date('2024-02-01'),
    response: null
  },
  {
    _id: 'demo-4',
    guestName: 'Emily Davis',
    rating: 5,
    text: 'The food recommendations from the host were excellent! Best local dining experience.',
    sentiment: 'positive',
    themes: ['food', 'host'],
    date: new Date('2024-02-10'),
    response: null
  },
  {
    _id: 'demo-5',
    guestName: 'Robert Brown',
    rating: 3,
    text: 'Average stay. Nothing special but nothing terrible either.',
    sentiment: 'neutral',
    themes: ['value'],
    date: new Date('2024-02-15'),
    response: null
  }
];

let inMemoryReviews = fallbackReviews.map(review => ({ ...review }));

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL || 'http://localhost:5173' : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'staysense-session-secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many authentication attempts. Please try again later.' }
});

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

function validateAuthRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array().map(error => error.msg) });
  }
  next();
}

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`
  }, async (_accessToken, _refreshToken, profile, done) => {
    try {
      const existing = await findByEmail(profile.emails?.[0]?.value || `${profile.id}@oauth.local`);
      if (existing) {
        return done(null, existing);
      }

      const randomPassword = `${profile.id}-${Date.now()}`;
      const passwordHash = await bcrypt.hash(randomPassword, 12);
      const created = await createUser({ email: profile.emails?.[0]?.value || `${profile.id}@oauth.local`, passwordHash });
      done(null, created);
    } catch (error) {
      done(error);
    }
  }));
}

function isMongoAvailable() {
  return Boolean(process.env.MONGODB_URI) && mongoose.connection.readyState === 1;
}

function getFallbackReviews(filters = {}) {
  let reviews = [...inMemoryReviews];

  if (filters.sentiment) {
    reviews = reviews.filter(review => review.sentiment === filters.sentiment.toLowerCase());
  }

  if (filters.theme) {
    reviews = reviews.filter(review => review.themes.includes(filters.theme.toLowerCase()));
  }

  if (filters.minRating || filters.maxRating) {
    reviews = reviews.filter(review => {
      const min = filters.minRating ? parseInt(filters.minRating, 10) : 1;
      const max = filters.maxRating ? parseInt(filters.maxRating, 10) : 5;
      return review.rating >= min && review.rating <= max;
    });
  }

  return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function buildStatsFromReviews(reviews) {
  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews) * 10) / 10
    : 0;

  const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
  reviews.forEach(review => {
    if (sentimentCounts[review.sentiment] !== undefined) {
      sentimentCounts[review.sentiment] += 1;
    }
  });

  const themeCounts = {};
  reviews.forEach(review => {
    review.themes.forEach(theme => {
      themeCounts[theme] = (themeCounts[theme] || 0) + 1;
    });
  });

  return {
    totalReviews,
    averageRating,
    sentimentCounts,
    themeCounts
  };
}

// Connect to MongoDB if configured
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
      console.error('MongoDB connection error:', err);
      console.log('Falling back to in-memory review data');
    });
} else {
  console.log('No MONGODB_URI configured. Using in-memory review data.');
}

// Validation helper
function validateReview(review) {
  const errors = [];
  
  if (!review.guestName || review.guestName.trim().length === 0) {
    errors.push('Guest name is required');
  }
  
  if (!review.text || review.text.trim().length === 0) {
    errors.push('Review text is required');
  }
  
  if (review.rating === undefined || review.rating < 1 || review.rating > 5) {
    errors.push('Rating must be between 1 and 5');
  }
  
  return errors;
}

// Routes

app.post(
  '/api/auth/register',
  authLimiter,
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  validateAuthRequest,
  async (req, res) => {
    try {
      const existingUser = await findByEmail(req.body.email);
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'An account with that email already exists' });
      }

      const passwordHash = await bcrypt.hash(req.body.password, 12);
      const user = await createUser({ email: req.body.email, passwordHash });

      const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: { id: user.id, email: user.email }
      });
    } catch (error) {
      console.error('Register error:', error);
      return res.status(500).json({ success: false, error: 'Server error while registering user' });
    }
  }
);

app.post(
  '/api/auth/login',
  authLimiter,
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validateAuthRequest,
  async (req, res) => {
    try {
      const user = await findByEmail(req.body.email);
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }

      const passwordMatches = await bcrypt.compare(req.body.password, user.passwordHash || user.password_hash || '');
      if (!passwordMatches) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }

      const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email }
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ success: false, error: 'Server error while logging in' });
    }
  }
);

app.get('/api/auth/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({ success: false, error: 'Google OAuth is not configured' });
  }
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/auth/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login` }), async (req, res) => {
  const token = jwt.sign({ sub: req.user.id, email: req.user.email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?token=${token}`);
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const user = await findById(req.user.sub);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.status(200).json({ success: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error while loading profile' });
  }
});

// GET /api/reviews - List all reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const { sentiment, theme, minRating, maxRating } = req.query;

    if (isMongoAvailable()) {
      const query = {};

      if (sentiment) {
        query.sentiment = sentiment.toLowerCase();
      }

      if (theme) {
        query.themes = theme.toLowerCase();
      }

      if (minRating || maxRating) {
        query.rating = {};
        if (minRating) query.rating.$gte = parseInt(minRating, 10);
        if (maxRating) query.rating.$lte = parseInt(maxRating, 10);
      }

      const reviews = await Review.find(query).sort({ date: -1 });

      return res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
      });
    }

    const reviews = getFallbackReviews({ sentiment, theme, minRating, maxRating });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while fetching reviews'
    });
  }
});

// GET /api/reviews/stats - Get review statistics
app.get('/api/reviews/stats', async (req, res) => {
  try {
    if (isMongoAvailable()) {
      const totalReviews = await Review.countDocuments();

      const ratingStats = await Review.aggregate([
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' }
          }
        }
      ]);

      const sentimentCounts = await Review.aggregate([
        {
          $group: {
            _id: '$sentiment',
            count: { $sum: 1 }
          }
        }
      ]);

      const themeCounts = await Review.aggregate([
        { $unwind: '$themes' },
        {
          $group: {
            _id: '$themes',
            count: { $sum: 1 }
          }
        }
      ]);

      const sentimentResult = {
        positive: 0,
        neutral: 0,
        negative: 0
      };

      sentimentCounts.forEach(item => {
        sentimentResult[item._id] = item.count;
      });

      const themeResult = {};
      themeCounts.forEach(item => {
        themeResult[item._id] = item.count;
      });

      return res.status(200).json({
        success: true,
        data: {
          totalReviews,
          averageRating: ratingStats[0] ? Math.round(ratingStats[0].averageRating * 10) / 10 : 0,
          sentimentCounts: sentimentResult,
          themeCounts: themeResult
        }
      });
    }

    const reviews = getFallbackReviews();
    const stats = buildStatsFromReviews(reviews);

    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Stats route error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching statistics'
    });
  }
});

// GET /api/reviews/search - Search reviews
app.get('/api/reviews/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query parameter "q" is required'
      });
    }

    if (isMongoAvailable()) {
      const results = await Review.find({
        $or: [
          { text: { $regex: q, $options: 'i' } },
          { guestName: { $regex: q, $options: 'i' } },
          { themes: { $regex: q, $options: 'i' } }
        ]
      });

      return res.status(200).json({
        success: true,
        count: results.length,
        query: q,
        data: results
      });
    }

    const results = getFallbackReviews().filter(review => {
      const haystack = `${review.guestName} ${review.text} ${review.themes.join(' ')}`.toLowerCase();
      return haystack.includes(q.toLowerCase());
    });

    return res.status(200).json({
      success: true,
      count: results.length,
      query: q,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while searching reviews'
    });
  }
});

// GET /api/reviews/:id - Get single review
app.get('/api/reviews/:id', async (req, res) => {
  try {
    if (isMongoAvailable()) {
      const review = await Review.findById(req.params.id);

      if (!review) {
        return res.status(404).json({
          success: false,
          error: 'Review not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: review
      });
    }

    const review = inMemoryReviews.find(item => item._id === req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while fetching review'
    });
  }
});

app.post('/api/ai/summarise', async (req, res) => {
  try {
    const reviewText = req.body?.reviewText?.trim();
    const variant = req.body?.variant || 'balanced';

    if (!reviewText) {
      return res.status(400).json({ success: false, error: 'Review text is required' });
    }

    const result = await generateAiResponse(reviewText, variant);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('AI summarise error:', error);
    return res.status(502).json({
      success: false,
      error: error.message || 'The AI service failed to respond.'
    });
  }
});

// POST /api/reviews - Create review
app.post('/api/reviews', requireAuth, async (req, res) => {
  try {
    const errors = validateReview(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    if (isMongoAvailable()) {
      const newReview = new Review({
        guestName: req.body.guestName,
        rating: req.body.rating,
        text: req.body.text,
        sentiment: req.body.sentiment || 'neutral',
        themes: req.body.themes || [],
        date: req.body.date || new Date(),
        response: req.body.response || null
      });

      await newReview.save();

      return res.status(201).json({
        success: true,
        data: newReview
      });
    }

    const newReview = {
      _id: `demo-${Date.now()}`,
      guestName: req.body.guestName,
      rating: req.body.rating,
      text: req.body.text,
      sentiment: req.body.sentiment || 'neutral',
      themes: req.body.themes || [],
      date: req.body.date || new Date(),
      response: req.body.response || null
    };

    inMemoryReviews = [newReview, ...inMemoryReviews];

    return res.status(201).json({
      success: true,
      data: newReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while creating review'
    });
  }
});

// PUT /api/reviews/:id - Update review
app.put('/api/reviews/:id', requireAuth, async (req, res) => {
  try {
    if (isMongoAvailable()) {
      const review = await Review.findById(req.params.id);

      if (!review) {
        return res.status(404).json({
          success: false,
          error: 'Review not found'
        });
      }

      const errors = validateReview(req.body);

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          errors
        });
      }

      review.guestName = req.body.guestName;
      review.rating = req.body.rating;
      review.text = req.body.text;
      review.sentiment = req.body.sentiment || review.sentiment;
      review.themes = req.body.themes || review.themes;
      review.date = req.body.date || review.date;
      review.response = req.body.response !== undefined ? req.body.response : review.response;

      await review.save();

      return res.status(200).json({
        success: true,
        data: review
      });
    }

    const reviewIndex = inMemoryReviews.findIndex(item => item._id === req.params.id);
    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    const errors = validateReview(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    inMemoryReviews[reviewIndex] = {
      ...inMemoryReviews[reviewIndex],
      guestName: req.body.guestName,
      rating: req.body.rating,
      text: req.body.text,
      sentiment: req.body.sentiment || inMemoryReviews[reviewIndex].sentiment,
      themes: req.body.themes || inMemoryReviews[reviewIndex].themes,
      date: req.body.date || inMemoryReviews[reviewIndex].date,
      response: req.body.response !== undefined ? req.body.response : inMemoryReviews[reviewIndex].response
    };

    return res.status(200).json({
      success: true,
      data: inMemoryReviews[reviewIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while updating review'
    });
  }
});

// DELETE /api/reviews/:id - Delete review
app.delete('/api/reviews/:id', requireAuth, async (req, res) => {
  try {
    if (isMongoAvailable()) {
      const review = await Review.findById(req.params.id);

      if (!review) {
        return res.status(404).json({
          success: false,
          error: 'Review not found'
        });
      }

      await Review.findByIdAndDelete(req.params.id);

      return res.status(204).send();
    }

    const reviewIndex = inMemoryReviews.findIndex(item => item._id === req.params.id);
    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    inMemoryReviews.splice(reviewIndex, 1);

    return res.status(204).send();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while deleting review'
    });
  }
});

// POST /api/reviews/:id/response - Add response to review
app.post('/api/reviews/:id/response', requireAuth, async (req, res) => {
  try {
    if (isMongoAvailable()) {
      const review = await Review.findById(req.params.id);

      if (!review) {
        return res.status(404).json({
          success: false,
          error: 'Review not found'
        });
      }

      if (!req.body.response || req.body.response.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Response text is required'
        });
      }

      review.response = req.body.response;
      await review.save();

      return res.status(200).json({
        success: true,
        data: review
      });
    }

    const reviewIndex = inMemoryReviews.findIndex(item => item._id === req.params.id);
    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    if (!req.body.response || req.body.response.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Response text is required'
      });
    }

    inMemoryReviews[reviewIndex].response = req.body.response;

    return res.status(200).json({
      success: true,
      data: inMemoryReviews[reviewIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while adding response'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
