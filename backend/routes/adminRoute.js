const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const ProtectRoute = require('../middlewares/protectRoute')


router.post('/api/admin/resetpassword',
    ProtectRoute,
    adminController.resetPassword
)
router.delete('/api/users/delete/:username', async (req, res) => {
    try {
        const username = req.params.username;

        // Find the user by username
        const user = await userModel.findOne({ userName: username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove user from following and followres of other users
        await userModel.updateMany(
            { following: user._id },
            { $pull: { following: user._id } }
        );
        await userModel.updateMany(
            { followres: user._id },
            { $pull: { followres: user._id } }
        );

        // Find all posts made by the user and delete them
        const posts = await postModel.find({ user: user._id });
        const postIds = posts.map(post => post._id);
        await postModel.deleteMany({ user: user._id });

        // Remove likes by this user from all posts
        await postModel.updateMany(
            { likes: user._id },
            { $pull: { likes: user._id } }
        );

        // Remove comments made by this user from all posts
        await postModel.updateMany(
            {},
            { $pull: { comments: { user: user._id } } }
        );

        // Finally, delete the user
        await userModel.deleteOne({ _id: user._id });

        res.status(200).json({ message: 'User and related data deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;