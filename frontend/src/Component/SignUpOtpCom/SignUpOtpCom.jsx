import "./SignUpOtpCom.css"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function SignUpOTPCom() {

    let navigate = useNavigate()
    let email = window.localStorage.getItem("email")
    let [enteredOtp, setEnteredOtp] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        if (!enteredOtp.trim()) {
            alert("Please enter the OTP.")
            return
        }
        try {
            const response = await fetch("http://localhost:8000/signup/otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, enteredOtp })
            })
            if (response.ok) {
                let data = await response.json()
                window.localStorage.setItem("isSignedin", true)
                window.localStorage.removeItem("email")
                alert(`${data.message}`)
                navigate("/")
            }
            else {
                alert("Incorrect OTP.")
            }
        }
        catch (error) {
            alert("An error occured. Please try again.")
        }
    }

    async function handleResendOtp() {
        try {
            const response = await fetch("http://localhost:8000/signup/resend-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            })
            if (response.ok) {
                alert("A new OTP has been sent to your email.")
            }
            else {
                alert("Unable to resend OTP. Please try again.")
            }
        }
        catch (error) {
            alert("An error occurred while resending OTP.")
        }
    }

    return (
        <div className="otp-container">
            <div className="otp-box">
                <div>
                    <p className="otp-title">Verify</p>
                </div>
                <p className="otp-subtitle">Enter OTP sent on your email</p>
                <form>
                    <input type="number" autoFocus onChange={(e) => setEnteredOtp(e.target.value)} className="otp-input" />
                    <button onClick={(e) => handleSubmit(e)} className="otp-submit">Submit OTP</button>
                </form>
                <button onClick={handleResendOtp} className="otp-resend">Resend OTP</button>
            </div>
        </div>
    )
}