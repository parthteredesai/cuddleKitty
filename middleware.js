const Joi = require('joi');
const session = require("express-session");
const methodOverride = require('method-override');

const Kitty = require("./models/Kitty.js");
const User = require("./models/User.js");



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; 
        return res.redirect("/login");       
    }
    next(); 
};

const userUpdateSchema = Joi.object({
    age: Joi.number().integer().min(1).max(100).required().messages({
        'number.base': 'Age must be a number',
        'any.required': 'Age is required'
    }),
    contact: Joi.number().integer().required().messages({
        'number.base': 'Contact must be a number',
        'any.required': 'Contact is required'
    }),
    address: Joi.string().required().trim().messages({
        'string.empty': 'Address cannot be empty'
    }),
    description: Joi.string().required().trim().messages({
        'string.empty': 'The "about yourself" section cannot be empty'
    })
});

module.exports.validateUserUpdate = (req, res, next) => {
    const { error } = userUpdateSchema.validate(req.body);
    
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        return res.status(400).send(`Validation Error: ${msg}`);
    } else {
        next(); 
    }
};

const kittyValidationSchema = Joi.object({
    name: Joi.string().required().trim().messages({
        'string.empty': 'Kitty name cannot be empty.'
    }),
    breed: Joi.string().required().trim().messages({
        'string.empty': 'Breed cannot be empty.'
    }),
    age: Joi.number().min(0).max(30).required().messages({
        'number.base': 'Age must be a valid number.',
        'number.min': 'Age cannot be negative.'
    }),
    description: Joi.string().required().trim().messages({
        'string.empty': 'Please write a description for the kitty.'
    }),
    image: Joi.string().uri().allow('').trim()
});

module.exports.validateKitty = (req, res, next) => {
    
    if (req.body.image === '') {
        delete req.body.image;
    }

    const { error } = kittyValidationSchema.validate(req.body);
    
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        return res.status(400).send(`Validation Error: ${msg}`);
    } else {
        next(); 
    }
};

module.exports.isFilledProfileForm = (req, res, next) => {
    if(!req.user) {
        console.log("User not login");
        return res.redirect("/login");
    }

    if(req.user.formCnt === 0) {
        return res.send("FILL THE PROFILE FORM FIRST... VISIT USER ACCOUNT");
    }

    next();
}

module.exports.isKittyOwner = async (req, res, next) => {
    const { id } = req.params;

    const kitty = await Kitty.findById(id);

    if (!kitty) {
        return res.status(404).send("This kitty profile does not exist.");
    }

    if(kitty.owner.equals(req.user._id)) {
        return next();
    }
    return res.send("invalid user");
}

module.exports.isUserTheOwner = async (req, res, next) => {

    const { id } = req.params;
    const user = await User.findById(id);

    if(user._id.equals(req.user._id)) {
        return next();
    }
    return res.send("NOT REAL OWNER");
}