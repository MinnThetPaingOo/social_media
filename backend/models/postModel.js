const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    text: {
        type: String
    },
    img: [{
        data: {
            type: String, // Store filename or URL
        },
        contentType: {
            type: String, // MIME type of the file
        }
    }],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            text: {
                type: String,
                required: true
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            userName: {
                type: String,
            },
            fullName: {
                type: String,
            }
        },
    ]
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
