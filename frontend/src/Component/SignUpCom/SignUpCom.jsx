import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './SignUpCom.css'
import loginpic from '../../assets/loginpic.png'
import logo from '../../assets/logo.png'
import default_profile_photo from '../../assets/default_profile.png'

const SignUpCom = () => {

  let [userInfo, setUserInfo] = useState({
    fullname: "",
    username: "",
    mobNo: "",
    email: "",
    password: "",
    gender: "",
    dob: "",
    profile_photo: default_profile_photo
  })
  let navigate = useNavigate()
  let [confirmPassword, setConfirmPassword] = useState("")
  let [isTCmarked, setIsTCmarked] = useState(false)

  function handleInputChange(e) {
    let { name, value } = e.target
    if (name === "confirmPassword") {
      setConfirmPassword(value)
    }
    else {
      if (name === "name") {
        setUserInfo(prev => ({ ...prev, fullname: value }))
      }
      else if (name === "username") {
        setUserInfo(prev => ({ ...prev, username: value }))
      }
      else if (name === "mobile") {
        setUserInfo(prev => ({ ...prev, mobNo: value }))
      }
      else if (name === "email") {
        setUserInfo(prev => ({ ...prev, email: value }))
      }
      else if (name === "password") {
        setUserInfo(prev => ({ ...prev, password: value }))
      }
      else if (name === "gender") {
        setUserInfo(prev => ({ ...prev, gender: value }))
      }
      else if (name === "dob") {
        setUserInfo(prev => ({ ...prev, dob: value }))
      }
    }
  }

  async function handleSignUp(e) {
    e.preventDefault()
    if (userInfo.fullname.trim() === "") {
      alert("Please enter fullname.")
      return
    }
    if (userInfo.username.trim() === "") {
      alert("Please enter username.")
      return
    }
    if (userInfo.mobNo.length !== 10) {
      alert("Mobile number should be a valid 10 digit number.")
      return
    }
    if (!userInfo.email.endsWith("@gmail.com") && !userInfo.email.endsWith("vjti.ac.in")) {
      alert("Enter valid email address (e.g., exmaple@gmail.com or example@xyz.vjti.ac.in).")
      return
    }
    if (userInfo.password.length < 8) {
      alert("Password must contain atleast 8 characters.")
      return
    }
    if (userInfo.password !== confirmPassword) {
      alert("Password does not match with confirmed password")
      return
    }
    if (userInfo.gender.trim() === "") {
      alert("Please select gender.")
      return
    }
    if (userInfo.username.trim() === "") {
      alert("Please select date of birth.")
      return
    }
    if (!isTCmarked) {
      alert("Please check mark the T&C box.")
    }
    try {
      let response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({userInfo})
      })
      const data = await response.json()
      if (response.ok) {
        window.localStorage.setItem("username", userInfo.username)
        window.localStorage.setItem("email", userInfo.email)
        navigate("/signup/otp")
      }
      else if (response.status === 408) {
        alert(`${data.message}`)
      }
      else if (response.status === 409) {
        alert(`${data.message}`)
      }
      else if (response.status === 410) {
        alert(`${data.message}`)
      }
      else {
        alert("An unexpected error occured.")
      }
    }
    catch (error) {
      console.log(error)
      alert("An error occurred during sign-up. Please refresh and try again.");
      navigate("/")
    }
  }

  return (
    <div className="signup-main-container">
      {/* Left section */}
      <div className="signup-left">
        <img src={loginpic} alt="Mentorship" className="side-img" />
      </div>

      {/* Right section - form */}
      <div className="signup-right">
        <div className="logo-text">
          <div className="logo1">
            <img src={logo} alt="Logo" className="logo" />
            <h1 className="site-name">MentorConnect</h1>
          </div>
          <p className="site-tagline">Meet Your Mentor: Bridging the Gap Between Aspiration and Experience</p>
        </div>

        <form className="signup-form">

          {/* Row 1: Name */}
          <div className="form-row">
            <input type="text" value={userInfo.fullname} name="name" placeholder="Full Name" required onChange={(e) => handleInputChange(e)} />
          </div>

          {/* Row 2: Username & Mobile */}
          <div className="form-row">
            <input type="text" value={userInfo.username} name="username" placeholder="Username" required onChange={(e) => handleInputChange(e)} />
            <input type="tel" value={userInfo.mobNo} name="mobile" placeholder="Mobile Number" required onChange={(e) => handleInputChange(e)} />
          </div>

          {/* Row 3: Email */}
          <div className="form-row">
            <input type="email" value={userInfo.email} name="email" placeholder="Email" required onChange={(e) => handleInputChange(e)} />
          </div>

          {/* Row 4: Password & Confirm Password */}
          <div className="form-row">
            <input type="password" value={userInfo.password} name="password" placeholder="Password" required onChange={(e) => handleInputChange(e)} />
            <input type="password" value={confirmPassword} name="confirmPassword" placeholder="Confirm Password" required onChange={(e) => handleInputChange(e)} />
          </div>

          {/* Row 5: Gender & DOB */}
          <div className="form-row">
            <select name="gender" value={userInfo.gender} required onChange={(e) => handleInputChange(e)}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input type="date" value={userInfo.dob} name="dob" required onChange={(e) => handleInputChange(e)} />
          </div>

          {/* Row 6: Checkbox */}
          <div className="form-row checkbox-row">
            <div className='checkbox'>
              <input type="checkbox" checked={isTCmarked} onChange={() => setIsTCmarked(prev => !prev)} name="agree" required />
              <span>I agree to the terms and conditions </span>
            </div>
          </div>

          {/* Row 7: Submit Button */}
          <div className="form-row">
            <button type="submit" onClick={(e) => handleSignUp(e)}>Sign Up</button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default SignUpCom

