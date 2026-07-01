const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

//reuired the controller file for authorization
const authController = require("../controllers/authController");

//middleware
const middleware = require("../middleware.js"); // to check isLoggedIn, isUserTheOwner
const wrapAsync = require("../utils/wrapAsync"); // not used wrapAsync here

// GET: Show signup form
router.get("/register", authController.renderRegisterPage);

//login route
router.get("/login", authController.renderLoginPage);

// logout route
router.get("/logout",authController.logoutUser);

//post request that authenticate user
router.post("/login", authController.loginUser);

//post User.reister(user(req.body), password) method
router.post("/register", authController.registerUser);

//userProfile form that updates user info from user profile page form
router.put("/register/:id", middleware.isLoggedIn, middleware.isUserTheOwner, middleware.validateUserUpdate, authController.updateUser);

// delete request that deletes the user from database, takes userid as parameter, finds all 
// kitties with owner as userid and deletes them as well 
router.delete("/:id/delete", middleware.isUserTheOwner, authController.deleteUser);

module.exports = router;