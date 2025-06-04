const mongoose = require('mongoose')
require('dotenv').config()

const mongoURI = process.env.MONGODB_URI.replace("<db_name>", "otp_MARG_DARSHAK_db")
const otpdb = mongoose.createConnection(mongoURI)

let otpSchema = new mongoose.Schema({
    fullname: {
        type: String
    },
    username: {
        type: String
    },
    mobNo: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    otp: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: 300 }
    },
    profile_photo: {
        type: String
    },
    gender: {
        type: String
    },
    dob: {
        type: String
    }
})

let Otp = otpdb.model("Otp", otpSchema)

module.exports = Otp