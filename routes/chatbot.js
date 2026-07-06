const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {

    console.log("Received from browser:", req.body);

    try {

        const response = await axios.post(
            "http://127.0.0.1:8000/chat",
            {
                message: req.body.message
            }
        );

        console.log("FastAPI Response:", response.data);

        res.json(response.data);

    } catch (err) {

         console.error("========== CHATBOT ERROR ==========");
    console.error("Message:", err.message);
    console.error("Status:", err.response?.status);
    console.error("Data:", err.response?.data);
    console.error("===================================");

        res.status(500).json({
            reply: "Sorry, PawBot is currently unavailable."
        });

    }

});

module.exports = router;