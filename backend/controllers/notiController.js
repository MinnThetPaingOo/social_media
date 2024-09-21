const NotiModel = require('../models/notificationModel')

const NotiController = {
    getnoti: async (req, res) => {
        try {
            const userId = req.user._id
            const notifications = await NotiModel.find({ to: userId })
                .populate({
                    "path": "from",
                    select: "userName profilePicture"
                });

            await NotiModel.updateMany({ to: userId }, { read: true })
            res.json(notifications)
        } catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(500).json({ message: 'Error fetching notifications', error });
        }
    },
    delete: async (req, res) => {
        try {
            const userId = req.user._id;
            await NotiModel.deleteMany({ to: userId })
            res.json({ msg: "deleted all noti" })
        } catch (error) {

        }
    }
}

module.exports = NotiController