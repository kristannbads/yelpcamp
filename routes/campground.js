const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const {isLoggedIn, isAuthor, validateCampground}=require('../middleware');

const catchAsync = require('../utils/catchAsync');

const campground = require('../controllers/campground');


router.route("/")
    .get(catchAsync(campground.index))
    .post(isLoggedIn, upload.array('image', 10), validateCampground, catchAsync(campground.createCampground));
    // .post(isLoggedIn, upload.array('image', 10), (req, res) => {
    //     console.log(req.files, req.body)
    //     res.send(req.files)
    // })
 
router.get("/new", isLoggedIn, campground.renderNewForm)

router.route("/:id")
    .get(catchAsync(campground.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image', 10), validateCampground, catchAsync(campground.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campground.renderEditForm))

module.exports = router;