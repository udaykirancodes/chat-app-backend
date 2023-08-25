const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    port: process.env.PORT || 8000,
    jwt: 'MY#SECRET@CODE$',
    mongoose: {
        url: process.env.MONGOURL,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
}