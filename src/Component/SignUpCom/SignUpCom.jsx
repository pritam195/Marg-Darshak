import React from 'react'
import './SignUpCom.css'
import loginpic from '../../assets/loginpic.png'
import logo from '../../assets/logo.png'

const SignUpCom = () => {
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
            <input type="text" name="name" placeholder="Full Name" required />
          </div>

          {/* Row 2: Username & Mobile */}
          <div className="form-row">
            <input type="text" name="username" placeholder="Username" required />
            <input type="tel" name="mobile" placeholder="Mobile Number" required />
          </div>

          {/* Row 3: Email */}
          <div className="form-row">
            <input type="email" name="email" placeholder="Email" required />
          </div>

          {/* Row 4: Password & Confirm Password */}
          <div className="form-row">
            <input type="password" name="password" placeholder="Password" required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
          </div>

          {/* Row 5: Gender & DOB */}
          <div className="form-row">
            <select name="gender" required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input type="date" name="dob" required />
          </div>

          {/* Row 6: Checkbox */}
          <div className="form-row checkbox-row">
            <div className='checkbox'>
              <input type="checkbox" name="agree" required />
              <span>I agree to the terms and conditions </span> 
            </div>
          </div>

          {/* Row 7: Submit Button */}
          <div className="form-row">
            <button type="submit">Sign Up</button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default SignUpCom

