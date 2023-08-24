const mongoose = require('mongoose');
const ConversationSchema = new mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Messages",
        require: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Conversations", ConversationSchema);