const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Any additional admin-specific fields can be added here
});

module.exports = mongoose.model('Admin', adminSchema);
