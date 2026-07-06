const express = require("express");
const router = express.Router();
const axios = require("axios");

const Kitty = require("../models/Kitty");

// POST /match/find-match
router.post("/find-match", async (req, res) => {

    try {

        console.log("Questionnaire:");
        console.log(req.body);

        // Get every cat from MongoDB
        const cats = await Kitty.find({});

        // Send questionnaire + cats to FastAPI
        const response = await axios.post(
            "http://127.0.0.1:8000/match-cats",
            {
                questionnaire: req.body,
                cats: cats
            }
        );

        console.log("AI Response:");
        console.dir(response.data, { depth: null });

        // Merge AI results with MongoDB data
        const matches = response.data.matches.map(match => {

    const dbCat = cats.find(cat =>
        cat.name.trim().toLowerCase() ===
        match.name.trim().toLowerCase()
    );

    return {

        id: dbCat ? dbCat._id : null,

        name: dbCat ? dbCat.name : match.name,

        breed: dbCat ? dbCat.breed : "",

        age: dbCat ? dbCat.age : "",

        image: dbCat ? dbCat.image : "",

        score: match.score,

        reason: match.reason

    };

});
        console.log("Merged Matches:");
        console.log(matches);

        const topMatches = matches.slice(0, 5);
        res.json({
                matches: topMatches
        });

    }

    catch (err) {

        console.log("========== MATCH ERROR ==========");

        console.log("Status:", err.response?.status);

        console.log("Data:", err.response?.data);

        console.log("Message:", err.message);

        console.log("=================================");

        res.status(500).json({
            error: err.response?.data || err.message
        });

    }

});

module.exports = router;