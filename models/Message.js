const mongoose = require('mongoose');
const messagesSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    seen: {
        type: Boolean,
        default: false
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversations",
    },
    message: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model("Messages", messagesSchema);