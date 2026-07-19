const mongoose = require('mongoose');
require('dotenv').config();
const Review = require('./models/Review');

const sampleReviews = [
  {
    guestName: 'John Smith',
    rating: 5,
    text: 'Amazing stay! The host was incredibly friendly and the location was perfect.',
    sentiment: 'positive',
    themes: ['host', 'location'],
    date: new Date('2024-01-15'),
    response: null
  },
  {
    guestName: 'Sarah Johnson',
    rating: 4,
    text: 'Great experience overall. The place was clean but the WiFi was a bit slow.',
    sentiment: 'positive',
    themes: ['cleanliness', 'value'],
    date: new Date('2024-01-20'),
    response: null
  },
  {
    guestName: 'Mike Wilson',
    rating: 2,
    text: 'Disappointed with the cleanliness. Found dust in corners and bathroom needed attention.',
    sentiment: 'negative',
    themes: ['cleanliness'],
    date: new Date('2024-02-01'),
    response: null
  },
  {
    guestName: 'Emily Davis',
    rating: 5,
    text: 'The food recommendations from the host were excellent! Best local dining experience.',
    sentiment: 'positive',
    themes: ['food', 'host'],
    date: new Date('2024-02-10'),
    response: null
  },
  {
    guestName: 'Robert Brown',
    rating: 3,
    text: 'Average stay. Nothing special but nothing terrible either.',
    sentiment: 'neutral',
    themes: ['value'],
    date: new Date('2024-02-15'),
    response: null
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Review.deleteMany({});
    console.log('Cleared existing reviews');

    // Insert sample data
    await Review.insertMany(sampleReviews);
    console.log('Inserted sample reviews');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
