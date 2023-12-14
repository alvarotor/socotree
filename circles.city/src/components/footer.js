import React from "react"
import { Link } from "gatsby"
import logo from "../images/meetberlinlogo.svg"

const Footer = () => (
  <div className="footer">
    <Link to="/">
      <img src={logo} width="98.5" alt="logo" className="image" />
    </Link>
    <div className="container w-container">
      <Link to="/impressum" className="link">
        Impressum
      </Link>
      <Link to="/datenschutzerklarung" className="link-2">
        Datenschutzerklärung
      </Link>
      <Link to="/about" className="link-2">
        About
      </Link>
      <Link to="/contact" className="link-2">
        Contact Us
      </Link>
      <Link to="/berlin" className="link-2">
        Berlin
      </Link>
      <Link to="/berlin_de" className="link-2">
        Berlin DE
      </Link>
      <br />
      <br />© {new Date().getFullYear()}
    </div>
  </div>
)

export default Footer
