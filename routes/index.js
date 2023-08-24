const router = require('express').Router();

const AuthRoutes = require('./Auth');
const UserRoutes = require('./Users');
const RequestRoutes = require('./Requests');
const ChatRoutes = require('./Chat');


router.use('/auth', AuthRoutes);
router.use('/request', RequestRoutes);
router.use('/chat', ChatRoutes);
router.use('/', UserRoutes);

module.exports = router