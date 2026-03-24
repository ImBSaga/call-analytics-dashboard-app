const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

/**
 * Seed default accounts if database is empty.
 */
async function seedUsers() {
  const count = await User.countDocuments();
  if (count > 0) return;

  const demoUsers = [
    { email: 'admin@pinevox.com', password: 'Admin@1234', name: 'PineVox Admin', role: 'admin' },
    { email: 'analyst@pinevox.com', password: 'Analyst@1234', name: 'PineVox Analyst', role: 'analyst' },
  ];

  for (const u of demoUsers) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await User.create({ email: u.email, passwordHash, name: u.name, role: u.role });
  }
}

async function findByEmail(email) {
  return await User.findOne({ email: email.toLowerCase() });
}

async function findById(id) {
  return await User.findById(id);
}

async function createUser({ email, plainPassword, name, role = 'analyst' }) {
  const passwordHash = await bcrypt.hash(plainPassword, 10);
  return await User.create({ email, passwordHash, name, role });
}

function toPublic(user) {
  if (!user) return null;
  const { passwordHash: _omit, ...pub } = user.toObject ? user.toObject() : user;
  delete pub.passwordHash;
  return pub;
}

module.exports = { findByEmail, findById, createUser, toPublic, seedUsers };
