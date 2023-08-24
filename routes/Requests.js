const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
// Importing Models
const FetchUser = require('../FetchUser');
const User = require('../models/User');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
// Send a Friend Request
router.post('/send-request', FetchUser, async (req, res) => {
    try {
        let currentUserId = req.user.id; // this user is sending
        let { receiverId } = req.body; // req to this user
        if (!currentUserId || !receiverId) {
            console.log('Info Not Found');
            return res.status(400).json({ success: false, msg: "User Id Required" })
        }
        if (currentUserId === receiverId) {
            console.log('U Cont')
            return res.status(400).json({ success: false, msg: "You Can't Request Yourself!" })
        }
        let user = await User.findById(currentUserId)
        if (!user.sentFriendRequests.includes(receiverId)) {
            // Update Current User's "sentFriendRequests"
            await User.findByIdAndUpdate(currentUserId, {
                $push: {
                    sentFriendRequests: receiverId
                }
            })
            // Update Receivers Friend Requests
            await User.findByIdAndUpdate(receiverId, {
                $push: {
                    friendRequests: currentUserId
                }
            })
            return res.status(200).json({ success: true });
        }
        console.log('Req Already Sent')
        return res.status(400).json({ success: false, msg: "Request Already Sent" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
})
// Show Friend Requests of Logged In User
router.get('/friend-requests', FetchUser, async (req, res) => {
    try {
        let id = req.user.id;
        let user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ success: false, msg: "User Not Found" });
        }
        let { friendRequests } = await User.findById(id).populate("friendRequests", "name email image").lean();
        res.status(200).json({ success: true, data: friendRequests })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
})
// Show Friend Requests of Logged In User
router.get('/sent-requests', FetchUser, async (req, res) => {
    try {
        let id = req.user.id;
        let user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ success: false, msg: "User Not Found" });
        }
        let { sentFriendRequests } = await User.findById(id).populate("sentFriendRequests", "name email image").lean();
        res.status(200).json({ success: true, data: sentFriendRequests })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
})
// accept friend request
router.post('/accept-request', FetchUser, async (req, res) => {
    try {
        let { requestId } = req.body;
        if (!requestId) {
            return res.status(400).json({ success: false, msg: "Requst ID is Mandatory" })
        }
        let id = new mongoose.Types.ObjectId(req.user.id); // current user is receiver
        let receiver = await User.findById(id); // receiver
        if (!receiver) {
            return res.status(400).json({ success: false, msg: "User Not Found" });
        }
        let sender = await User.findById(requestId);
        if (!sender) {
            return res.status(400).json({ success: false, msg: "User Not Found" });
        }
        if (receiver.friendRequests.includes(requestId)) {
            receiver.friendRequests = receiver.friendRequests.filter((re) => re.toString() !== sender._id.toString());
            sender.sentFriendRequests = sender.sentFriendRequests.filter((re) => re.toString() !== receiver._id.toString());
            sender.friends.push(receiver._id);
            receiver.friends.push(sender._id);
            await sender.save();
            await receiver.save();
            let newConvo = new Conversation({
                members: [sender._id, receiver._id],
                lastMessage: null
            })
            let saved = await newConvo.save();
            return res.status(200).json({ success: true })
        }

        res.status(400).json({ success: false, msg: "Request Not Exists" })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
})


module.exports = router;