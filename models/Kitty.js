// models/Kitty.js data model for kitty
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KittySchema = new Schema({
    name: {
        type: String,
        required: true
    },

    breed: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        required: true
    },
    
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1583524505974-6facd53f4597?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Default cat image
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User' // Links the listing to a registered user
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Kitty', KittySchema);