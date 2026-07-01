
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require("express");
const server = express();
const mongoose = require('mongoose');
const Kitty = require('./models/Kitty');

const dbUrl = process.env.MONGO_URL;

mongoose.connect(dbUrl)
    .then(() => console.log("kitty sample data loaded..!"))
    .catch(err => console.log("Database connection error:", err));

const loadKittyData = async () => {
    // Clear out existing test data first
    await Kitty.deleteMany({});
    
    const dummyKitties = [
        {
            name: "Biscuit",
            breed: "Tabby",
            age: 2, // Matches your Number type schema constraint
            description: "Enjoys kneading invisible dough and sleeping on computer keyboards.",
            image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500"
        },
        {
            name: "Mochi",
            breed: "Siamese",
            age: 4,
            description: "Extremely vocal. Will demand iced coffee cuddles 24/7.",
            image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=500"
        }
    ];

    await Kitty.insertMany(dummyKitties);
    console.log("Database successfully populated with cute kittens!");
    mongoose.connection.close();
};

loadKittyData();