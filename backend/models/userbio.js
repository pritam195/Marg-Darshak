const mongoose = require('mongoose')
require('dotenv').config()

const mongoURI = process.env.MONGODB_URI.replace("<db_name>", "userbio_MARG-DARSHAK_db")
const userbiodb = mongoose.createConnection(mongoURI)

let userBioSchema = new mongoose.Schema({
    username: {
        type: String
    },
    bio: {
        type: String
    },
    resume: {
        type: String
    },
    profile_photo: {
        type: String,
    },
    educational_details: [{
        standard: String,
        marks: String,
        institution: String,
        institution_address: String
    }],
    social_links: [{
        name: String,
        link: String
    }],
    work_experience: [{
        company_name: String,
        role: String,
        place: String,
        duration: String,
        features: []
    }]
})

let UserBio = userbiodb.model("UserBio", userBioSchema)

module.exports = UserBio;