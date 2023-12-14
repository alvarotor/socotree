import PropTypes from "prop-types"
import React from "react"
import { Link } from "gatsby"
import Train from "../components/indexImages/header/train"
import logo from "../images/meetberlinlogo.svg"
import cta from "../images/cta.svg"

var style = {
  height: 120,
}

const Header = ({ siteTitle, train, linkbutton }) => (
  <div className="hero">
    <Link to="/">
      <img src={logo} width="98.5" className="image" alt="logo" />
    </Link>
    <div className="columns w-row">
      <div className="column-4 w-col w-col-6 w-col-stack">
        <h1 className="heading-3">{siteTitle}</h1>
        {train === "remove" ? null : linkbutton ? (
          <a href={linkbutton}>
            <img src={cta} height="66" className="image-2" alt="title" />
          </a>
        ) : (
          <div style={style} />
        )}
      </div>
      <div className="column-5 w-col w-col-6 w-col-stack">
        {train === "remove" ? null : <Train />}
      </div>
    </div>
  </div>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
  linkbutton: PropTypes.string,
  train: PropTypes.bool,
}

Header.defaultProps = {
  siteTitle: ``,
  linkbutton: ``,
  train: true,
}

export default Header
