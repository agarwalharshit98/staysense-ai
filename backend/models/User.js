const mongoose = require('mongoose');

const inMemoryUsers = [];

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: [true, 'Password hash is required']
  }
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function findByEmail(email) {
  if (mongoose.connection.readyState === 1) {
    return User.findOne({ email });
  }

  return inMemoryUsers.find(user => user.email === email) || null;
}

async function createUser({ email, passwordHash }) {
  if (mongoose.connection.readyState === 1) {
    const user = new User({ email, passwordHash });
    await user.save();
    return user;
  }

  const user = {
    id: `user-${Date.now()}`,
    email,
    passwordHash,
    createdAt: new Date()
  };

  inMemoryUsers.push(user);
  return user;
}

async function findById(id) {
  if (mongoose.connection.readyState === 1) {
    return User.findById(id);
  }

  return inMemoryUsers.find(user => user.id === id) || null;
}

module.exports = {
  findByEmail,
  createUser,
  findById
};
