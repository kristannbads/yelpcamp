// if (process.env.NODE_ENV !== "production") {
//     require('dotenv').config();
// }

require('dotenv').config();


const express = require('express');
const ejsMAte = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const ExpressError = require('./utils/ExpressError');
const helmet = require('helmet');
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/review');
const userRoutes = require('./routes/user');

const User = require('./models/user');

mongoose.connect("mongodb://127.0.0.1:27017/yelpcamp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.engine('ejs', ejsMAte)

app.use(morgan('common'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, '/public')))
app.use(
    mongoSanitize({
      replaceWith: '_',
    }),
  );

sessionConfig = {
    name: 'broomSes',
    secret: "mySecretPassword",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 3600000,
        maxAge: 1000 * 60 * 60 * 24 * 1,
        httpOnly: true,
        // secure: true,
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    // if(!['/login', '/'].includes(req.originalUrl)) {
    //     req.session.returnTo = req.originalUrl;
    // }
    console.log(req.query)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();

})


app.use('/', userRoutes);
app.use('/campground', campgroundRoutes);
app.use('/campground/:id/review', reviewRoutes);


app.get("/", (req, res) => {
    
    res.render("home")
})

app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh no error"
    res.status(statusCode).render('error', { err })
})

app.listen(3000, (err) => {
    if (err) {
        console.log("Error in server setup");
    }
    else {
        console.log("Listening on Port 3000");
    }
}
)
