const Notification = require('../models/Notification');
const cloudinary = require('../config/cloudinary');

// Create Notification (only for Admin)
exports.createNotification = async (req, res) => {
  const { title, description } = req.body;
  const file = req.file; // Assuming the file is uploaded via multipart form data

  if (!file) {
    return res.status(400).json({ message: 'Document file is required' });
  }

  try {
    // Upload file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      resource_type: 'auto', // Automatically detect file type (pdf, jpg, png, etc.)
      folder: 'notifications' // Optional: specify a folder in Cloudinary
    });

    // Create and save notification in MongoDB
    const notification = new Notification({
      title,
      description,
      documentLink: uploadResult.secure_url
    });

    await notification.save();

    res.status(201).json({ message: 'Notification created successfully', notification });
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error: error.message });
  }
};
