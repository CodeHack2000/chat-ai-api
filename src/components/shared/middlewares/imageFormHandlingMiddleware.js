const Multer = require('multer');

// Store the image in memory temporarily
const storage = Multer.memoryStorage();

const uploadImage = Multer({ storage }).single('avatar');

module.exports = (req, res, next) => {

    uploadImage(req, res, (err) => {

        const result = {
            status: 400,
            message: '',
            success: false
        };

        if (err) {

            result.message = err.message;
            return res.status(result.status).json(result);
        }
        else if (!req.file) {

            result.message = 'No file uploaded';
            return res.status(result.status).json(result);
        }
        else {

            next();
        }
    });
};