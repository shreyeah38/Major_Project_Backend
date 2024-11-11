const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');


// Student sign up
exports.studentSignup = async (req, res) => {
  const { name, email, enrollment, year, password } = req.body;

  try {
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) return res.status(400).json({ message: 'Student already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({ name, email, enrollment, year, password: hashedPassword });
    await student.save();

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error in student signup', error: error.message });
  }
};

// Admin sign up
exports.adminSignup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error in admin signup', error: error.message });
  }
};

// Student login
exports.studentLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Student login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error in student login', error: error.message });
  }
};

// Admin login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Admin login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error in admin login', error: error.message });
  }
};

// Student Profile
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password'); // Exclude password

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student profile', error: error.message });
  }
};

// Student Profile via Enrollment
exports.getStudentProfileByEnrollment = async (req, res) => {
  const { enrollment } = req.params;

  try {
    const student = await Student.findOne({ enrollment }).select('-password'); // Exclude password

    if (!student) {
      return res.status(404).json({ message: 'Student not found with this enrollment number' });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student profile', error: error.message });
  }
};

// Log out
exports.logout = (req, res) => {
  res.cookie('token', '', { expires: new Date(0), httpOnly: true }); // Clear the cookie
  res.status(200).json({ message: 'Successfully logged out' });
};
