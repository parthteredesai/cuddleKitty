//here all lityy related crud opearions will be performed
const express = require('express');
const router = express.Router();
const Kitty = require("../models/Kitty.js");

//middleware
const middleware = require("../middleware.js"); // to check isLoggedIn, isUserTheOwner
const wrapAsync = require("../utils/wrapAsync"); // not used wrapAsync here

//kittyController require
const kittyController = require('../controllers/kittyController.js');

//homepage route /kitty
router.get("/", middleware.isLoggedIn, kittyController.index);

// new listing /kitty/new
router.get("/new", middleware.isFilledProfileForm, middleware.isLoggedIn, kittyController.renderNewForm);

// user profile page /kitty/user
router.get("/user", middleware.isLoggedIn, kittyController.renderUserProfile);

// "/kitty/:id(kitty._id)" -> renders viewKitty.ejs wit kitty id as parameter
router.get("/:id", middleware.isLoggedIn, kittyController.viewKitty);

// "/kitty/edit/:id(kitty._id)" -> renders editKitty.ejs along with kitty id as parameter 
router.get("/edit/:id", middleware.isLoggedIn, middleware.isKittyOwner,kittyController.renderEditKitty);

// "/kitty/yourlist/:id(user._id)" -> renders yourKitty.ejs with userid as parameter
router.get("/yourList/:id", middleware.isLoggedIn, middleware.isUserTheOwner,kittyController.showYourList);

//post new kitty
router.post("/", middleware.isLoggedIn, middleware.validateKitty, kittyController.addNewKitty);

// put request that updates the edited information of kitty taking kitty id as parameter
router.put("/:id", middleware.isLoggedIn, middleware.isKittyOwner, kittyController.updateKitty);

// delete request that delets the kitty from database using kitty id as parameter
router.delete("/:id/delete",middleware.isLoggedIn, middleware.isKittyOwner, kittyController.deleteKitty);

module.exports = router;