const UserModel = require('../models/userModel')
const bcrypt = require('bcrypt');

const adminController = {
    resetPassword: async (req, res) => {
        const { email, userName, newPassword } = req.body;

        if (!email && !userName) {
            return res.status(400).json({ error: 'Either email or username is required' });
        }

        try {
            // Log the request data for debugging
            // console.log('Request data:', { email, userName });

            // Find the user by email or username
            const user = await UserModel.findOne({ $or: [{ email }, { userName }] });

            // Log the user found for debugging
            // console.log('User found:', user);

            if (!user) {
                return res.status(404).json({ error: 'User not found indb' });
            }

            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update the user's password
            user.password = hashedPassword;
            await user.save();

            res.status(200).json({ message: 'Password reset successfully' });
        } catch (error) {
            console.error('Error resetting password:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },
    resetPAssw0rd: (req, res) => {
        try {
            res.send("hit")

        } catch (error) {

        }
    }
};

module.exports = adminController