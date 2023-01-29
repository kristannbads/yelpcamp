const User = require('../models/user');


module.exports.renderRegisterForm = (req, res) => {
    
    res.render("register");
}

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "You have successfully registered!");
            res.redirect('/campground');
        })
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect('/')
    }

}

module.exports.renderLoginForm = (req, res) => {
    
    res.render("login");
}

module.exports.login =  (req, res) => {
       
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.returnTo || '/campground';
    delete req.session.returnTo;
    return res.redirect(redirectUrl);
  

}

module.exports.logout = (req, res, next) => {
    
    req.logout(req.user, err => {
        if(err) return next(err);
        req.flash("success", "Goodbye!");
        res.redirect('/campground');
    });
}