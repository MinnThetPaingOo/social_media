const UserModel = require('../models/userModel')
const createToken = require("../helpers/createToken")
const bcrypt = require('bcrypt')

const AuthController = {
    register: async (req, res) => {
        try {
            const { fullName, userName, email, password } = req.body;
            var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!email.match(mailformat)) {
                throw new Error("Invalid email fromat")

            }
            let emailExits = await UserModel.findOne({ email })
            if (emailExits) {
                throw new Error("Email already exit")
            }
            let userNameExits = await UserModel.findOne({ userName })
            if (userNameExits) {
                throw new Error("Username already exit")
            }
            if (password.length < 6) {
                throw new Error("Password must be at least 6 characters")
            }
            let salt = await bcrypt.genSalt()
            let hashValue = await bcrypt.hash(password, salt)
            const newUser = await UserModel.create({
                fullName: fullName,
                userName,
                email,
                password: hashValue
            })
            await newUser.save()
            let token = createToken(newUser._id)
            res.cookie('jwt', token)
            return res.status(200).json({ newUser, token })
        } catch (error) {
            return res.status(400).json({ error: error.message })
        }


    },
    login: async (req, res) => {
        try {
            let { email, password } = req.body
            let user = await UserModel.findOne({ email });
            if (!user) {
                throw new Error('Email does not exists');
            }
            let isCorrect = await bcrypt.compare(password, user.password)
            if (!isCorrect) {
                throw new Error('Password incorrect');
            }
            let token = createToken(user._id)
            res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 })
            return res.status(200).json({ user, token })
        } catch (error) {
            return res.status(400).json({ error: error.message })
        }
    },
    logout: (req, res) => {
        res.cookie('jwt', '', { maxAge: 1 })
        return res.json({ msg: "logout" })
    },
    getme: (req, res) => {
        return res.json(req.user)

    },
    resetPassword: async (req, res) => {
        const { email, userName, newPassword } = req.body;

        if (!email && !userName) {
            return res.status(400).json({ error: 'Either email or username is required' });
        }

        try {
            // Find the user by email or username
            const user = await UserModel.findOne({ $or: [{ email }, { userName }] });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update the user's password
            user.password = hashedPassword;
            await user.save();

            res.status(200).json({ message: 'Password reset successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
}
module.exports = AuthController;
