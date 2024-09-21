const express = require('express')
const router = express.Router()
const PostController = require('../controllers/postController')
const ProtectRoute = require('../middlewares/protectRoute')
const upload = require('../helpers/upload')
const userModel = require('../models/userModel')
const postModel = require('../models/postModel')

router.get(
    '/api/posts/getallpost',
    ProtectRoute,
    PostController.getallpost
)
router.get(
    '/api/posts/following',
    ProtectRoute,
    PostController.getfollowingpost
)
router.get(
    '/api/posts/likedpost/:userName',
    ProtectRoute,
    PostController.getlikedpost
)

router.get(
    '/api/posts/user/:userName',
    ProtectRoute,
    PostController.getuserpost
)

router.post(
    '/api/posts/create',
    ProtectRoute,
    upload.single('img'),
    PostController.create
)
// router.post(
//     '/api/upload',
//     upload.single('file'),
//     (req, res) => {
//         res.send("upload successfully")
//     }

// )
router.post(
    '/api/posts/like/:id',
    ProtectRoute,
    PostController.like
)
router.post(
    '/api/posts/comment/:id',
    ProtectRoute,
    PostController.comment
)
router.delete(
    '/api/posts/delete/:id',
    ProtectRoute,
    PostController.delete
)

router.post('/api/upload', ProtectRoute, upload.array('files', 10), async (req, res) => {
    // req.files will contain information about all uploaded files
    try {
        // Check if files were uploaded
        if (!req.files) {
            return res.status(400).send('No files were uploaded.');
        }
        const userId = req.user._id.toString();
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const text = req.body.text;
        const imgArray = req.files ? req.files.map(file => ({
            data: file.filename,
            contentType: file.mimetype
        })) : [];

        if (!text && imgArray.length === 0) {
            throw new Error("Post must have text or image");
        }

        const newPost = new postModel({
            user: userId,
            text,
            img: imgArray,
            userName: user.userName,
            fullName: user.fullName,
        });

        await newPost.save();
        res.status(201).json(newPost);

        // Send success response with information about uploaded files
        // res.status(200).json({
        //     message: 'Files uploaded successfully',
        //     files: req.files // Array of file info
        // });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;