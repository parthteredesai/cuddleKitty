const Kitty = require("../models/Kitty");
const axios = require("axios");

module.exports.renderQuestionnaire = (req,res)=>{

    res.render("match/questionnaire");

};

module.exports.findMatch = async(req,res)=>{

    const cats = await Kitty.find();

    const questionnaire = req.body;

    try{

        const response = await axios.post(

            "http://127.0.0.1:8000/match-cats",

            {

                questionnaire,

                cats

            }

        );

        res.render(

            "match/results",

            {

                matches:response.data.matches

            }

        );

    }

    catch(err){

        console.log(err.message);

        res.send("AI Matchmaking Failed");

    }

}