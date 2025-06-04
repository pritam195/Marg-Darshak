import React, { useEffect, useState } from 'react'
import './Navbar.css'
import profile from '../../assets/profile.jpg'
import calender from '../../assets/calenderr.png'
import logo from '../../assets/logo.png'

const Navbar = () => {

    let [isSignedin, setIsSignedin] = useState(null)
    let username = window.localStorage.getItem("username")

    useEffect(() => {
        setIsSignedin(() => window.localStorage.getItem("isSignedin") === "true")
    }, [isSignedin])

    function handleLogOut() {
        window.localStorage.removeItem("username")
        window.localStorage.removeItem("isSignedin")
        setIsSignedin(false)
    }

    return (
        <div className="navbar">
            <div className="container">
                <div className="logo">
                    <img src={logo} alt="" />
                    <h1 className='logocolor'>MargDarshak</h1>
                </div>
                <div className="nav-links">
                    <ul>
                        <li><a href="../">Home</a></li>
                        <li><a href="/mentor">Mentors</a></li>
                        <li><a href="/chat">Chats</a></li>
                        <li><a href="/meeting">Meeting</a></li>
                        <li><img src={calender} alt="" /></li>
                    </ul>
                </div>
                <div className="profile">
                    {isSignedin ?
                        <div>
                            <a href={`/${username}/profile`}><img src={profile} alt="" /></a>
                            <button onClick={handleLogOut} >LogOut</button>
                        </div>
                        :
                        <button ><a href="/login">Login</a></button>
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar
