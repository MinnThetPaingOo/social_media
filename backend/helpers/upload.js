// const multer = require('multer')

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, __dirname + "/../uploads")
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + "-" + file.originalname)
//     }
// })

// const upload = multer({ storage: storage });

// module.exports = upload;

const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/../uploads')); // Set the destination for uploads
    },
    filename: function (req, file, cb) {
        // Generate a unique filename
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Set up multer with storage and optional file filter
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // Optional: Limit file size (10MB in this example)
    fileFilter: (req, file, cb) => {
        // Optional: File type filter (e.g., only images)
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mkv', 'video/avi'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

module.exports = upload;
