const Kitty = require("../models/Kitty.js");
const ExpressError = require("../utils/ExpressError");
const axios = require("axios");

// "/kitty/" homepage route -> renders kittyListings.ejs 
module.exports.index = async (req, res) => {
    try {
        const { breedChoice, kittyAge } = req.query;
        let mongoQuery = {};

        if ( breedChoice && breedChoice != "all" ) {
            mongoQuery.breed = breedChoice;
        }

        if ( kittyAge ) {
            mongoQuery.age = { $lte: Number(kittyAge) };;
        }

        const filteredKitties = await Kitty.find(mongoQuery).populate("owner").lean();

        res.render("./routes/kittyListings.ejs", { kitties: filteredKitties });
    }catch (e) {
        console.error(e);
        res.status(500).send("An error occurred executing database filters.");
    }
};

// "/kitty/new" -> renders new kitty list page
module.exports.renderNewForm = (req, res) => {
    res.render("./routes/newKitty.ejs"); 
};

//posts new kitty -> submit btn on newKitty.ejs posts and adds new kitty to database 
module.exports.addNewKitty = async (req, res) => {
    try {
        const { name, breed, age, description, image } = req.body;

        const newKitty = new Kitty({
            name,
            breed,
            age,
            description,
            image, 
            owner: req.user._id 
        });

        await newKitty.save();

        res.redirect('/kitty');
    } catch (e) {
        console.error(e);
        res.status(500).send("An error occurred while publishing the listing.");
    }
};

// "/kitty/user" -> renders user profile page
module.exports.renderUserProfile = (req, res) => {
    res.render("./routes/userProfile.ejs"); 
};

// "/kitty/yourlist/:id(user._id)" -> renders yourKitty.ejs with userid as parameter
module.exports.showYourList = async (req, res, next) => {

    const { id } = req.params;

    const kitties = await Kitty.find({ owner:id });

    if(kitties.length === 0){
        return next(new ExpressError("NO KITTIES FOUND", 404));
    }
    res.render("./routes/yourKittyList.ejs", { kitties });

};

// "/kitty/:id(kitty._id)" -> renders viewKitty.ejs with kitty id as parameter
// "/kitty/:id" -> renders viewKitty.ejs with AI generated description

module.exports.viewKitty = async (req, res, next) => {

    const { id } = req.params;

    try {

        const kitty = await Kitty.findById(id).populate("owner");

        if (!kitty) {
            return next(new ExpressError("Oops! That kitty profile does not exist.", 404));
        }

        let aiDescription = "";

        try {

            const response = await axios.post(
                "http://127.0.0.1:8000/generate-description",
                {
                    name: kitty.name,
                    breed: kitty.breed,
                    age: kitty.age,
                    description: kitty.description
                }
            );

            aiDescription = response.data.description;

        } catch (err) {

              console.log("Status:", err.response?.status);
              console.log("Error:", err.response?.data);

             aiDescription = kitty.description;

        }

        res.render("./routes/viewKitty.ejs", {
            kitty,
            aiDescription
        });

    } catch (err) {

        next(err);

    }

};

// "/kitty/edit/:id(kitty._id)" -> renders editKitty.ejs along with kitty id as parameter 
module.exports.renderEditKitty = async (req, res, next) => {
    const { id } = req.params;
    const kitty = await Kitty.findById(id);
    
    if (!kitty) {
        return next(new ExpressError("Oops! That kitty profile does not exist.", 404));
    }

    res.render("./routes/editKitty.ejs", { kitty }); 
};

// put request that updates the edited information of kitty taking kitty id as parameter
module.exports.updateKitty = async (req, res, next) => {
    const { id } = req.params;
    
    const updatedKitty = await Kitty.findByIdAndUpdate(
        id, 
        { ...req.body }, 
        { new: true, runValidators: true }
    );

    if (!updatedKitty) {
        return next(new ExpressError("Failed to update. Profile not found.", 404));
    }

    res.redirect(`/kitty/${id}`); 
};

// delete request that delets the kitty from database using kitty id as parameter
module.exports.deleteKitty = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        await Kitty.findByIdAndDelete(id);
        res.redirect(`/kitty/yourList/${req.user._id}`); 
    } catch (e) {
        next(e); 
    }
};