import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginCom.css'
import loginpic from '../../assets/loginpic.png'
import logo from '../../assets/logo.png'

const LoginCom = () => {

  let navigate = useNavigate()
  let [userInfo, setUserInfo] = useState({
    email: "",
    password: ""
  })

  function handleInputChange(e) {
    if (e.target.name === "email")
      setUserInfo(prev => ({ ...prev, email: e.target.value }))
    else if (e.target.name === "password")
      setUserInfo(prev => ({ ...prev, password: e.target.value }))
  }

  async function handleLogin(e) {
    e.preventDefault()
    let areAllFieldsFilled = Object.values(userInfo).some((value) => value.trim() === "")
    if (areAllFieldsFilled) {
      alert("Please fill out all fields before proceeding.")
      return
    }
    if (!userInfo.email.endsWith("@gmail.com") && !userInfo.email.endsWith("vjti.ac.in")) {
      alert("Email must be a valid Gmail address (e.g., example@gmail.com or example@xyz.vjti.ac.in).")
      return
    }
    if (userInfo.password.length < 8) {
      alert("Password must contain atleast 8 characters.")
      return
    }
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({userInfo})
      })
      if (response.ok) {
        const username = await response.json()
        window.localStorage.setItem("username", username)
        window.localStorage.setItem("isSignedin", true)
        alert("Login successful !")
        navigate("/")
      }
      else if (response.status === 403) {
        alert("The password is incorrect. Try again.")
      }
      else if (response.status === 404) {
        alert("User not found. Please Sign up first.")
        navigate("/signup")
      }
    }
    catch (error) {
      console.log(error)
      alert("An error occurred during sign-in. Please try again.");
      navigate("/")
    }
  }

  return (
    <div className="login">
      <div className="login-left">
        <img src={loginpic} alt="Login Visual" />
      </div>

      <div className="login-container">
        <div className="logo-text">
          <div className="logo1">
            <img src={logo} alt="" />
            <h1>MargDarshak</h1>
          </div>
          <p>Connecting Learners with Industry Experts: A Mentor Discovery Platform for Career Growth</p>
        </div>

        <div className="login-box">
          <h2>Login to Your Account</h2>
          <form className="login-form" >
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={userInfo.email}
              onChange={(e) => handleInputChange(e)}
              autoFocus
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={userInfo.password}
              onChange={(e) => handleInputChange(e)}
            />
            <button onClick={(e) => handleLogin(e)} type="submit">Login</button>
          </form>
          <p className="signup-link">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginCom
