const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
const Review = require("../models/review");
const axios = require('axios')


mongoose.connect("mongodb://127.0.0.1:27017/yelpcamp");


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    await Review.deleteMany({});
    
    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const priceRandom = Math.floor(Math.random() * 10) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: priceRandom,
            // description: await seedDesc()
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude,
                                cities[random1000].latitude,
            ]
            },
            description: 'Lorem ipsum',
            author: '637785f763b74a09db9663f1', // YOUR USER ID
            image: [
                {
                    url: await seedImg(),
                    filename: 'N/A'
                }
            ]
        })
        await camp.save();

    }
}

async function seedImg() {
    try {
        const resp = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                client_id: 'n_DO2xbU2ScNW3aBAqTrcKgb2oJj57UHWuN7D9AP-z0',
                collections: 'w5ZF_BrihRo',
            },
        })
        return resp.data.urls.small
    } catch (err) {
        console.error(err)
    }
}

// async function seedDesc() {
//     try {
//         const resp = await axios.get('https://api.unsplash.com/photos/random', {
//             params: {
//                 client_id: 'n_DO2xbU2ScNW3aBAqTrcKgb2oJj57UHWuN7D9AP-z0',
//                 collections: 'w5ZF_BrihRo',
//             },
//         })
//         return resp.data.description
//     } catch (err) {
//         console.error(err)
//     }
// }

seedDB();



// const seedDatabase = (cities) => {
//     data = cities.params;
//     console.log(data)
// }
console.log("Seeded")