const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require("express");
const server = express();

const mongoose = require("mongoose");
const session = require("express-session");
const ejsMate = require('ejs-mate');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require('method-override');

//ExpressError
const ExpressError = require("./utils/ExpressError.js");

//init method-override
server.use(methodOverride('_method'));

server.use(express.urlencoded({ extended: true }));
server.set("views", path.join(__dirname, "./views"));
server.use(express.static(path.join(__dirname, "public")));
//ejs 
server.set("view engine", "ejs");
server.engine('ejs', ejsMate);

server.use(express.urlencoded({ extended: true }));


//routers init
const router = express.Router();

const port = process.env.PORT || 8080;
const dbUrl = process.env.MONGO_URL;

mongoose.connect(dbUrl)
    .then(() => console.log("cuddleKitty Database connected..!"))
    .catch(err => console.log("Database connection error:", err));

//mongoose schema require
const User = require("./models/User.js");
const Kitty = require("./models/Kitty.js");


//router file require
const kittyRouter = require("./routes/kittyRoutes.js");
const authRouter = require("./routes/authRoutes.js");


//session init
server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

// 4. Passport Initialization
server.use(passport.initialize());
server.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//current session user
server.use((req, res, next) => {
    res.locals.currentUser = req.user || null;
    next();
});

//redirect to /kitty URL when request comes over /
server.get("/", (req, res) => {
    res.redirect("/kitty");
});

server.use("/", authRouter);
server.use("/kitty", kittyRouter);


// server.use((req,res,next) =>{
//     console.log("server is processing");
//     next();
// })

server.listen(port, (req,res) => {
    console.log(`Kitty server started on PORT ${port}..!`);
});


server.all("/*path", (req, res, next) => {
    next(new ExpressError('The page you are looking for does not exist.', 404));
});

server.use((err, req, res, next) => {
    const { statusCode = 500, message = "Internal Server Error" } = err;
    res.status(statusCode).render("./routes/error.ejs", { message });
});
