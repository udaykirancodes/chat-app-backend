const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    port: process.env.PORT || 8000,
    jwt: 'MY#SECRET@CODE$',
    mongoose: {
        // url: 'mongodb+srv://udaykirancodes:udaykirancodes@cluster0.ip9n0c4.mongodb.net/chat-app?retryWrites=true&w=majority',
        url: 'mongodb://localhost:27017/expo-app?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
}