const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now().toString() + '_' + file.originalname)
    }
})
const upload = multer({ storage: storage })
// Importing Models
const FetchUser = require('../FetchUser');
const User = require('../models/User');

// Access all users except the currently logged in user
router.get('/allusers', FetchUser, async (req, res) => {
    try {
        let userid = req.user.id;
        let allusers = await User.find({ _id: { $ne: userid } });
        res.status(200).json({ success: true, data: allusers })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
})
// get user details
router.get('/my-details', FetchUser, async (req, res) => {
    try {
        let id = req.user.id;
        let user = await User.findById(id);
        res.status(200).json({ success: true, data: user })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
})
// Get Friends of Logged in User
// router.get('/get-friends', FetchUser, async (req, res) => {
//     try {
//         let id = req.user.id;
//         let { friends } = await User.findById(id).populate("friends", "name email image");
//         res.status(200).json({ success: true, data: friends });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, msg: "Internal Server Error" });
//     }
// })

// Update Profile
router.post('/update-profile', FetchUser, upload.single('avatar'), async (req, res) => {
    try {
        console.log('Requested')
        let id = req.user.id;
        let user = await User.findByIdAndUpdate(id);
        if (!user) {
            console.log('user not found')
            return res.status(400).json({ success: false, msg: "User Not Found" });
        }
        let { name } = req.body;
        if (!name) {
            res.status(400).json({ success: false, msg: "Name is Required" });
        }
        user.name = name;
        if (req.file) {
            user.image = '/uploads/' + req.file.filename;
        }
        await user.save();
        res.status(200).json({ success: true, msg: 'Updated!' })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, msg: "Internal Server Error" })
    }
})
// User Info
router.get('/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let user = await User.findById(id);
        if (!user) {
            res.status(400).json({ success: false, msg: "Not Found" })
        }
        return res.status(200).json({ success: true, data: user });
    } catch (error) {

    }
})
module.exports = router