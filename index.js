const mongoose = require('mongoose');
const { server } = require('./app');
const config = require('./config');
mongoose.set('strictQuery', true);
// Database Connection
mongoose.connect(config.mongoose.url, config.mongoose.options)
    .then(() => {
        console.log("Connected To DataBase");
        // Listening to Server
        server.listen(config.port, () => {
            console.log("Server Started : " + config.port);
        })
    })
    .catch((err) => {
        console.log(err.message);
    })