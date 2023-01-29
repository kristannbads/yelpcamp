const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    filename: String,
    url: String,
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
});

const opts = { toJSON: { virtuals: true } }; //To see virtuals in object in client side

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    image: [ImageSchema],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, opts);

CampgroundSchema.virtual('properties.popUpMarkUp').get(function () {
    return `<strong><a href="/campground/${this._id}">${this.title}</a></strong>
            <p>${this.description.substring(0, 20)}...</p>`
});

CampgroundSchema.post('findOneAndDelete', async (doc) => {

    if (doc) {
       await Review.deleteMany({
           _id: {
               $in: doc.reviews
        }
       })
    }

})



module.exports = mongoose.model("Campground", CampgroundSchema);