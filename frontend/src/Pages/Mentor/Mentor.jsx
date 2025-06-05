import React, { useState } from 'react'
import MentorLeft from '../../Component/MentorLeft/MentorLeft.jsx'
import Navbar from '../../Component/Navbar/Navbar.jsx'
import MentorRight from '../../Component/MentorRight/MentorRight.jsx'

export const Context = React.createContext()

const Mentor = () => {

  let [mentorsData, setMentorsData] = useState([])

  return (
    <Context.Provider value={[mentorsData, setMentorsData]} >
      <div>
        <Navbar></Navbar>
        <div className="main-content">
          <MentorLeft />
          <MentorRight />
        </div>
      </div>
    </Context.Provider>
  )
}

export default Mentor
