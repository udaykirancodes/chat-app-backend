const express = require('express');
const router = express.Router();

// Importing Models
const FetchUser = require('../FetchUser');
const User = require('../models/User');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// Create Conversation
router.post('/create-convo', async (req, res) => {
    try {
        let { receiverId, senderId } = req.body;
        let newConvo = new Conversation({
            members: [senderId, receiverId],
            lastMessage: null
        })
        let saved = await newConvo.save();
        return res.status(200).json({ success: false, data: saved });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
})
// Mark as Read
router.post('/mark-read/:convoId', FetchUser, async (req, res) => {
    try {
        let convoId = req.params.convoId;
        if (!convoId) {
            return res.status(400).json({ success: false, msg: "Id is Required" });
        }
        let convo = await Conversation.findById(convoId);
        if (!convo) {
            return res.status(400).json({ success: false, msg: "Id is Invalid" });
        }
        let userId = req.user.id;
        let msgId = convo.lastMessage;
        let msg = await Message.findById(msgId);
        if (msg.senderId.toString() === userId.toString()) {
            return res.status(400).json({ success: false });
        }
        msg.seen = true;
        await msg.save();
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.message, success: false, msg: "Internal Server Error" });
    }
})
// Send Message
router.post('/send-message', FetchUser, async (req, res) => {
    try {
        let senderId = req.user.id;
        let { receiverId, message, conversationId } = req.body;
        if (!message || !receiverId || !senderId) {
            return res.status(400).json({ success: false, msg: "All fields are Required" });
        }
        // if yes , take the id store MESSAGE with ConversationID
        let msg = new Message({
            senderId, receiverId, message, conversationId
        })
        let convo = await Conversation.findByIdAndUpdate(conversationId);
        let savedMessage = await msg.save();
        if (convo) {
            convo.lastMessage = savedMessage._id;
            await convo.save();
        }
        return res.status(200).json({ success: true, data: savedMessage })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
})

router.get('/get-convos', FetchUser, async (req, res) => {
    try {
        let id = req.user.id;
        const conversation = await Conversation.find({
            members: { $in: [id] },
        }).populate('members', 'name email image').populate('lastMessage').sort({
            updatedAt: -1
        }).lean();
        return res.status(200).json({ success: true, data: conversation })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
})
// fetch messages with CONVERSATION ID
router.get('/get-messages/:conversationId', FetchUser, async (req, res) => {
    let id = req.user.id;
    let { conversationId } = req.params;
    // console.log(id + ' ' + conversationId);
    if (!id || !conversationId) {
        console.log('Id is Req')
        return res.status(401).json({ success: false, msg: "Ids Required" })
    }
    try {
        let messages = await Message.find({ conversationId: conversationId })
        return res.status(200).json({ success: true, data: messages });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
})

module.exports = router