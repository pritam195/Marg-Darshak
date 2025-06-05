const express = require('express')
const cors = require('cors')
const sendEmail = require("./email/email")
const bcrypt = require('bcrypt')
require("dotenv").config()
const UserInfo = require("./models/userInfo")
const Otp = require("./models/otp")
const UserBio = require('./models/userbio')
const multer = require('multer')
const cloudinary = require("./uploadProfilePhoto")
const { CloudinaryStorage } = require('multer-storage-cloudinary')

const app = express()

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true
}

const PORT = process.env.PORT || 3000

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'posts',
        allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi', 'mkv', 'webm', 'pdf', 'zip', 'txt'],
        resource_type: 'auto'
    },
});

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 1024 } })

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
        let isUser = await UserInfo.findOne({ $or: [{ username: userInfo.username }, { mobNo: userInfo.mobNo }, { email: userInfo.email }] })
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
            await UserBio.create({ username: otpdata.username, profile_photo: otpdata.profile_photo })
            await Otp.deleteOne({ email })
            res.status(200).send({ message: "Signup successful!" })
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
        let userInfo = await UserInfo.findOne({ username }).select("fullname username email mobNo profile_photo gender dob")
        let userBio = await UserBio.findOne({ username })
        return res.status(200).json({ userInfo, userBio })
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
})

app.post("/:username/profile/profile-photo", upload.single("profile_photo"), async (req, res) => {
    let { username } = req.params
    let profile_photo = req.file.path
    try {
        await UserBio.findOneAndUpdate({ username }, { profile_photo }, { new: true })
        let data = await UserInfo.findOneAndUpdate({ username }, { profile_photo }, { new: true })
        res.status(200).send(data)
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
})

app.post("/:username/profile", async (req, res) => {
    let { username } = req.params
    let { userBio } = req.body
    try {
        let data = await UserBio.findOneAndUpdate({ username }, { $set: { ...userBio } }, { upsert: true, new: true })
        return res.status(200).json(data)
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
})

app.get("/mentor", async (req, res) => {
    try {
        let mentorsData = await UserBio.find({ work_experience: { $ne: [] } }).select("username profile_photo work_experience")
        return res.status(200).json(mentorsData)
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
})

app.post("/mentor", async (req, res) => {
    let { mentorSearch, filters } = req.body
    let query = {}
    if (mentorSearch && mentorSearch.trim() !== "") {
        query.$or = [
            { username: { $regex: mentorSearch.trim(), $options: "i" } },
            { "work_experience.0.company_name": { $regex: mentorSearch.trim(), $options: "i" } },
            { "work_experience.0.place": { $regex: mentorSearch.trim(), $options: "i" } },
            { "work_experience.0.role": { $regex: mentorSearch.trim(), $options: "i" } }
        ]
    }
    const yearMap = {
        "Less than 1 year": ["0 years", "0.5 years", "less than 1 year"],
        "1+ year": ["1 year", "1.5 years", "2 years", "3 years", "4 years", "5 years", "6 years", "7 years", "8 years", "9 years", "10 years"],
        "2+ years": ["2 years", "3 years", "4 years", "5 years", "6 years", "7 years", "8 years", "9 years", "10 years"],
        "3+ years": ["3 years", "4 years", "5 years", "6 years", "7 years", "8 years", "9 years", "10 years"],
        "5+ years": ["5 years", "6 years", "7 years", "8 years", "9 years", "10 years"],
        "10+ years": ["10 years", "11 years", "12 years"]
    }
    const expConditions = {};

    if (filters.company.length > 0) {
        expConditions.company_name = { $in: filters.company };
    }
    if (filters.year_of_exp.length > 0) {
        let durationsToMatch = []
        filters.year_of_exp.forEach(label => {
            if (yearMap[label]) {
                durationsToMatch = durationsToMatch.concat(yearMap[label])
            }
        })
        if (durationsToMatch.length > 0) {
            expConditions.duration = { $in: durationsToMatch }
        }
    }
    if (filters.location.length > 0) {
        expConditions.place = { $in: filters.location };
    }

    if (Object.keys(expConditions).length > 0) {
        query.work_experience = { $elemMatch: expConditions };
    }
    try {
        let mentorsData = await UserBio.find(query)
        return res.status(200).json(mentorsData)
    }
    catch (error) {
        console.error("Error fetching mentors:", error)
        res.status(500).send({ message: "Internal server error" })
    }
})

app.listen(PORT, () => {
    console.log("Server is listening...")
})