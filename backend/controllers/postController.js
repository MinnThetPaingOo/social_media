const notificationModel = require('../models/notificationModel')
const postModel = require('../models/postModel')
const PostModel = require('../models/postModel')
const userModel = require('../models/userModel')
const UserModel = require('../models/userModel')
const multer = require('multer')

const PostController = {
    create: async (req, res) => {
        try {
            const userId = req.user._id.toString();
            const user = await UserModel.findById(userId);
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

            const newPost = new PostModel({
                user: userId,
                text,
                img: imgArray,
                userName: user.userName,
                fullName: user.fullName,
            });

            await newPost.save();
            res.status(201).json(newPost);
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    like: async (req, res) => {
        try {
            const userId = req.user._id; // Get user ID from authenticated request
            const postId = req.params.id; // Get post ID from request parameters

            // Find the post and user by ID
            const post = await PostModel.findById(postId);
            const user = await UserModel.findById(userId);

            // Validate ObjectId format
            // if (!mongoose.Types.ObjectId.isValid(postId)) {
            //     return res.status(400).json({ error: "Invalid post ID format" });
            // }

            // Validate existence of post and user
            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // Check if user has already liked the post
            const userLikedPost = post.likes.includes(userId);

            if (userLikedPost) {
                // If user has already liked the post, remove like
                post.likes.pull(userId);
                user.likedPosts.pull(postId);
                await post.save();
                await user.save();
            } else {
                // If user has not liked the post, add like
                post.likes.push(userId);
                user.likedPosts.push(postId);
                await post.save();
                await user.save();

                // Create a new notification
                const newNoti = new notificationModel({
                    from: userId,
                    to: post.user,
                    type: "Like",
                    PostText: post.text,
                });
                await newNoti.save();
            }

            res.status(200).json({ post });

        } catch (error) {
            return res.status(400).json({ error: error.message })
        }
    },
    delete: async (req, res) => {
        try {
            const postId = req.params.id
            const post = await postModel.findByIdAndDelete(postId)
            if (!post) {
                throw new Error("Post Id not found")
            }
            if (post.user.toString() !== req.user._id.toString()) {
                throw new Error("You are not authorized to delete this post")
            }
            res.json({ msg: "Post Deleted" })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    comment: async (req, res) => {
        try {
            const postId = req.params.id
            const userId = req.user._id
            const { commentText } = req.body
            const post = await postModel.findById(postId)
            const user = await UserModel.findById(userId)
            if (!post) {
                throw new Error("Post not found")
            }
            if (!user) {
                throw new Error("User not found")
            }
            if (!commentText) {
                throw new Error("Text field is required")
            }
            // console.log(user)
            const comment = {
                user: user._id,
                text: commentText,
                userName: user.userName,
                fullName: user.fullName
            }
            post.comments.push(comment)
            await post.save()
            const text = post.text
            // console.log(text)
            const newNoti = new notificationModel({
                from: userId,
                to: post.user,
                type: "Comment",
                PostText: text
            })
            newNoti.save()
            res.status(200).json({ post })
        } catch (error) {
            res.status(404).json(error.message)
        }
    },
    getallpost: async (req, res) => {
        const { start = 0, limit = 5 } = req.query;
        try {
            // Fetch all posts and then shuffle them
            const allPosts = await PostModel.find().populate({
                path: "user",
                select: "-password"
            }).populate({
                path: "comments.user",
                select: "-password"
            })
            const sortedPosts = allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // Slice the posts array to get the required batch
            const postsToSend = sortedPosts.slice(parseInt(start), parseInt(start) + parseInt(limit));

            res.json(postsToSend);
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    getlikedpost: async (req, res) => {
        try {
            const { userName } = req.params;

            // Find user by userName
            const user = await userModel.findOne({ userName }).populate('likedPosts');

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Fetch the liked posts
            const likedPosts = await postModel.find({ _id: { $in: user.likedPosts } })
                .sort({ createdAt: -1 })
                .populate('user', '-password') // Exclude user password
                .populate('comments.user', '-password'); // Exclude user password in comments

            res.json(likedPosts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getfollowingpost: async (req, res) => {
        const { start = 0, limit = 5 } = req.query;
        try {
            const userId = req.user._id.toString()
            const user = await UserModel.findById(userId)
            if (!user) {
                throw new Error("Current user not found")
            }
            // Convert following usernames to user IDs
            const followingUsernames = user.following;

            // Find users by usernames
            const followingUsers = await UserModel.find({ userName: { $in: followingUsernames } });

            // Extract user IDs from the found users
            const followingUserIds = followingUsers.map(u => u._id);

            const follwingposts = await postModel.find({ user: { $in: followingUserIds } })
                .sort({ createdAt: -1 }).
                populate({
                    path: "user",
                    select: "-password"
                })
                .populate({
                    path: "comments.user",
                    select: "-password"
                })
            const sortedPosts = follwingposts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            // Slice the posts array to get the required batch
            const postsToSend = sortedPosts.slice(parseInt(start), parseInt(start) + parseInt(limit));
            return res.json(postsToSend)

        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    getuserpost: async (req, res) => {
        const { start = 0, limit = 5 } = req.query;
        try {
            const username = req.params
            console.log(username)
            const user = await UserModel.findOne(username)
            if (!user) {

                throw new Error("User not found")
            }
            const posts = await postModel.find({ user: { $in: user._id } })
                .sort({ createdAt: -1 }).
                populate({
                    path: "user",
                    select: "-password"
                })
                .populate({
                    path: "comments.user",
                    select: "-password"
                })
            const sortedPosts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            // Slice the posts array to get the required batch
            const postsToSend = sortedPosts.slice(parseInt(start), parseInt(start) + parseInt(limit));
            return res.json(postsToSend)

        } catch (error) {
            res.json({ error: error.message })
        }
    }
}

module.exports = PostController