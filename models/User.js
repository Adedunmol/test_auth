const { default: mongoose } = require('mongoose');
const { Schema } = require('mongoose');

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 2000
        },
        Moderator: Number,
        Admin: Number
    },
    refreshToken: [String]
});


module.exports = mongoose.model('User', userSchema);