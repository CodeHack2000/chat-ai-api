const Multer = require('multer');

// Store the image in memory temporarily
const storage = Multer.memoryStorage();

const uploadImage = Multer({ storage });

module.exports = uploadImage;