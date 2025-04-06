import { Link } from "react-router-dom";
import React from 'react'

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="nav-logo">dXpense</div>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/Login" className="nav-link">Login/Sign-up</Link>
      </div>
    </nav>
  )
}

export default NavBar
