const User = require('../models/User');
const Kitty  = require("../models/Kitty.js");
const passport = require('passport');

// "/register" -> renders signup page
module.exports.renderRegisterPage = (req, res) => {
    res.render('auth/register.ejs');
};

// post request of sign up that adds a new user to database
module.exports.registerUser = async (req, res, next) => {
    try{
        const {username, email, password} = req.body;
        const user = new User({ email, username });

        const registeredUser = await User.register(user, password);

        req.login(registeredUser, err => {
            if (err) return next(err);
            res.redirect("/");
        });
    } catch (e) {
        res.send(`Registration Error: ${e.message}`);
    }
};

//  post request that adds the info of user from the form in user rofile page
module.exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params; 
        const { age, contact, address, description } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { 
                age, 
                contact,
                address, 
                description,
                formCnt: 1 
            },
            {  returnDocument:'after', runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).send("User profile record not found.");
        }

        res.redirect('/kitty');
    } catch (e) {
        console.error(e);
        res.status(500).send("An error occurred executing database updates.");
    }
};

// "/login" -> renders logi page
module.exports.renderLoginPage = (req, res) => {
    res.render('auth/login');
};

//authenticate method to login user and to / route (homepage)
module.exports.loginUser = passport.authenticate('local', {
    failureRedirect: "/login",
    successRedirect: "/" // Sends them to homepage on success
});

// req.logout metod to logout the user session that redirects to "/login"
module.exports.logoutUser = (req, res, next) => {
    req.logout(function(err) {
        if (err) return next(err);
        res.redirect("/login");
    });
};

 // delete request that deletes the user from database, takes userid as parameter, finds all 
 // kitties with owner as userid and deletes them as well 
module.exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        await Kitty.deleteMany({ owner: id });

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).send("User profile not found.");
        }

        req.logout((err) => {
            if (err) return next(err);
            
            res.redirect("/"); 
        });

    } catch (e) {
        next(e); 
    }
};