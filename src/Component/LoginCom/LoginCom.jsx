import React from 'react'
import './LoginCom.css'
import loginpic from '../../assets/loginpic.png'
import logo from '../../assets/logo.png'

const LoginCom = () => {
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
            />
            <input
                type="password"
                placeholder="Password"
            />
            <button type="submit">Login</button>
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
