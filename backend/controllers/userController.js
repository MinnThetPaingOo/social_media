const UserModel = require('../models/userModel')
const NotiModel = require('../models/notificationModel')
const bcrypt = require('bcrypt')

const UserController = {
    getUserProfile: async (req, res) => {
        let username = req.params
        try {
            const user = await UserModel.findOne(username).select('-password')
            if (!user) {
                res.status(404).json({ msg: "user not found" })
            }
            if (user) {
                res.status(200).json(user)
            }
        } catch (error) {
            cosole.log("Error in getting user profile ", error.messqge)
            res.status(500).json({ msg: "internal server error" })
        }
    },
    followOrUnfollow: async (req, res) => {
        try {
            const currentUserName = req.user.userName; // Get the current user's username from authenticated request
            const modifyUserName = req.params.userName; // Get the username of the user to follow/unfollow from URL parameters
            // console.log(modifyUserName)
            // Validate if the current user is trying to follow/unfollow themselves
            if (currentUserName === modifyUserName) {
                return res.status(400).json({ msg: "You cannot follow yourself" });
            }

            // Find both users by their usernames
            const currentUser = await UserModel.findOne({ userName: currentUserName });
            const modifyUser = await UserModel.findOne({ userName: modifyUserName });

            // Check if both users exist
            if (!modifyUser) {
                return res.status(404).json({ msg: ' Modify User not found' });
            }
            if (!currentUser) {
                return res.status(404).json({ msg: ' Current User not found' });
            }

            // Check if the current user is already following the modifyUser
            const isFollowing = currentUser.following.includes(modifyUserName);

            if (!isFollowing) {
                // Add modifyUserName to the current user's following list
                await UserModel.findOneAndUpdate(
                    { userName: currentUserName },
                    { $push: { following: modifyUserName } }
                );
                // Add currentUserName to the modifyUser's followers list
                await UserModel.findOneAndUpdate(
                    { userName: modifyUserName },
                    { $push: { followres: currentUserName } }
                );
                return res.status(200).json({ msg: "Followed", userName: modifyUserName });
            } else {
                // Remove modifyUserName from the current user's following list
                await UserModel.findOneAndUpdate(
                    { userName: currentUserName },
                    { $pull: { following: modifyUserName } }
                );
                // Remove currentUserName from the modifyUser's followers list
                await UserModel.findOneAndUpdate(
                    { userName: modifyUserName },
                    { $pull: { followres: currentUserName } }
                );
                return res.status(200).json({ msg: "Unfollowed", userName: modifyUserName });
            }

        } catch (error) {
            return res.status(400).json({ error: error.message })

        }

    },
    suggest: async (req, res) => {
        try {
            let myId = req.user._id
            let following = await UserModel.findById(myId).select("following")
            //other users except me
            const users = await UserModel.aggregate([
                {
                    $match: {
                        _id: { $ne: myId }
                    }
                },
                { $sample: { size: 10 } }
            ]
            )
            const filteredUsers = users.filter(user => !following.following.includes(user._id))
            const suggestedUser = filteredUsers.slice(0, 4)
            suggestedUser.forEach(user => user.password = null)
            return res.status(200).json(suggestedUser)
        } catch (error) {
            console.error(error.name, error.message)
            return res.status(500).json(error.message)
        }
    },
    updateprofile: async (req, res) => {
        try {
            const { fullName, userName, email, currentPassword, newPassword, bio, link } = req.body
            // let { pp, cv } = req.body
            let userId = req.user._id
            let user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('login user not found')
            }
            // var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            // if (!email.match(mailformat)) {
            //     throw new Error("Invalid email fromat")

            // }
            if ((!currentPassword && newPassword) || (currentPassword && !newPassword)) {
                throw new Error("Please Enter Both Current Password And New Password")
            }
            if (currentPassword && newPassword) {
                const isMatch = await bcrypt.compare(currentPassword, user.password)
                if (!isMatch) {
                    throw new Error("Current password is incorrect")
                }
                if (newPassword.length < 6) {
                    throw new Error("Password must be atleast 6 characters")
                }
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.fullName = fullName || user.fullName;
            user.email = email || user.email;
            user.userName = userName || user.userName;
            user.password = hashedPassword || user.password;
            user.bio = bio || user.bio;
            user.link = link || user.link;
            // console.log(user)
            user = await user.save()
            return res.json(user)
        } catch (error) {
            return res.status(400).json({ error: error.message })
        }
    },
    uploadPP: async (req, res) => {
        try {
            let userId = req.user._id
            let user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('login user not found')
            }
            return res.status(200).send("hit")
            const { pp, cv } = req.body
        } catch (error) {

        }
    }
}

module.exports = UserController