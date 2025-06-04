const express = require('express')
const cors = require('cors')
const sendEmail = require("./email/email")
const bcrypt = require('bcrypt')
require("dotenv").config()
const UserInfo = require("./models/userInfo")
const Otp = require("./models/otp")
const UserBio = require('./models/userbio')

const app = express()

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true
}

const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors(corsOptions))

app.get("/", () => {
    console.log("Hello")
})

app.post("/login", async (req, res) => {
    let { userInfo } = req.body
    try {
        let isUser = await UserInfo.findOne({ email: userInfo.email })
        if (!isUser) {
            return res.status(404).send({ message: "User not found" })
        }
        const isPasswordValid = await bcrypt.compare(userInfo.password, isUser.password);
        if (!isPasswordValid) {
            return res.status(403).send({ message: "Password is incorrect" });
        }
        return res.status(200).json(isUser.username)
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
})

app.post("/signup", async (req, res) => {
    let { userInfo } = req.body
    try {
        let isUser = await UserInfo.findOne({ $or: [{ username: userInfo.username }, {mobNo: userInfo.mobNo}, { email: userInfo.email }] })
        if (isUser) {
            if (isUser.username === userInfo.username) {
                res.status(408).send({ "message": "Username already exists." })
                return
            }
            else if (isUser.email === userInfo.email) {
                res.status(409).send({ "message": "Email already in use. You can login using this email." })
                return
            }
            else if (isUser.mobNo === userInfo.mobNo) {
                res.status(410).send({ "message": "Mobile number already in use. Please enter other mobile number." })
                return
            }
        }
        let otp = Math.floor(100000 + Math.random() * 900000)
        await sendEmail(userInfo.email, otp)
        let hashedPassword = await bcrypt.hash(userInfo.password, 10)
        await Otp.findOneAndUpdate({ email: userInfo.email }, { fullname: userInfo.fullname, username: userInfo.username, mobNo: userInfo.mobNo, email: userInfo.email, password: hashedPassword, otp: otp, profile_photo: userInfo.profile_photo, gender: userInfo.gender, dob: userInfo.dob }, { upsert: true, new: true })
        return res.status(200).json("Success")
    }
    catch (error) {
        return res.status(500).json("Internal server error")
    }
})

app.post("/signup/otp", async (req, res) => {
    let { email, enteredOtp } = req.body
    try {
        let otpdata = await Otp.findOne({ email: email })
        if (parseInt(otpdata.otp) === parseInt(enteredOtp)) {
            await UserInfo.create({
                fullname: otpdata.fullname,
                username: otpdata.username,
                mobNo: otpdata.mobNo,
                email: otpdata.email,
                password: otpdata.password,
                profile_photo: otpdata.profile_photo,
                gender: otpdata.gender,
                dob: otpdata.gender
            })
            await Otp.deleteOne({ email })
            res.status(200).send({message: "Signup successful!"})
        }
        else if (otpdata.otp !== parseInt(enteredOtp)) {
            res.status(403).send("Incorrect OTP")
        }
    }
    catch (error) {
        console.log(error)
        res.json("Internal server error")
    }
})

app.post("/signup/resend-otp", async (req, res) => {
    let { email } = req.body
    try {
        let otpData = await Otp.findOne({ email: email })
        if (!otpData) {
            return res.status(404).send({ message: "No OTP request found for this email. Please sign up again." })
        }
        let otpsent = Math.floor(100000 + Math.random() * 900000)
        await sendEmail(email, otpsent)
        await Otp.findOneAndUpdate(
            { email: email },
            { otp: otpsent, createdAt: new Date() },
            { new: true }
        )
        res.status(200).send({ message: "New OTP sent successfully" })
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
})

app.get("/:username/profile", async (req, res) => {
    let { username } = req.params
    try {
        let userInfo = await UserInfo.findOne({username}).select("fullname username email mobNo profile_photo gender dob")
        let userBio = await UserBio.findOne({username})
        return res.status(200).json({userInfo, userBio})
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
})

app.post("/:username/profile", async (req, res) => {
    let { username } = req.params
    let { userBio } = req.body
    try {
        let data = await UserBio.findOneAndUpdate({username}, { $set: { ...userBio } }, {upsert: true, new: true})
        return res.status(200).json(data)
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
})

app.listen(PORT, () => {
    console.log("Server is listening...")
})