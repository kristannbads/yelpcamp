const express = require('express');
const passport = require('passport');
const router = express.Router();



const catchAsync = require('../utils/catchAsync');
const user = require('../controllers/user')

router.route("/register")
    .get(user.renderRegisterForm )
    .post( catchAsync(user.register));

router.route("/login")
    .get(user.renderLoginForm)
    .post(passport.authenticate('local',
        { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }),
        catchAsync(user.login)
    );

router.get("/logout", user.logout)

module.exports = router;