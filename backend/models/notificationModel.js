const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Follow', 'Like', 'Comment']
    },
    LikedPostText: {
        type: String,
        // required: true,
    },
    CommentedPosttext: {
        type: String,
    },
    PostText: {
        type: String
    },
    read: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

module.exports = mongoose.model("Notification", NotificationSchema)