const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  enrollment: { type: String, required: true },
  year: { type: String, required: true },
  password: { type: String, required: true },
  
  // Any additional student-specific fields can be added here
});

module.exports = mongoose.model('Student', studentSchema);
