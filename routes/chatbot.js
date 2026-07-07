const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {

    console.log("Received from browser:", req.body);

    try {

        const response = await axios.post(
            `${process.env.FASTAPI_URL}/chat`,
            {
                message: req.body.message
            }
        );

        console.log("FastAPI Response:", response.data);

        return res.json(response.data);

    } catch (err) {

        console.error("========== CHATBOT ERROR ==========");
        console.error("Message:", err.message);
        console.error("Status:", err.response?.status);
        console.error("Data:", err.response?.data);
        console.error("===================================");

        return res.status(500).json({
            reply: "Sorry, PawBot is currently unavailable."
        });

    }

});

module.exports = router;