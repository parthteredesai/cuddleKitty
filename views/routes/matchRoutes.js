const express = require("express");
const router = express.Router();

router.post("/find-match", async (req, res) => {

    res.json({
        message: "Match route working"
    });

});

module.exports = router;