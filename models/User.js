const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const plugin = passportLocalMongoose.default || passportLocalMongoose;

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    age: {
        type: Number
    },
    address: {
        type: String
    },
    formCnt: {
        type: Number,
        default: 0
    },
    contact: {
        type: Number,
    
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// to handle hashing and authentication
UserSchema.plugin(plugin);
const User = mongoose.model('User', UserSchema);

module.exports = User;