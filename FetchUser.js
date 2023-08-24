const jwt = require('jsonwebtoken');
const config = require('./config');

const isUser = (req, res, next) => {
    const token = req.header('authToken');
    if (!token) {
        console.log('Token Not Found');
        return res.status(300).json({ success: false, msg: "Invalid AuthToken" });
    }
    try {
        let data = jwt.verify(token, config.jwt);
        req.user = data.user
        next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, msg: "Internal Server Error" })
    }
}

module.exports = isUser;