/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import Footer from "./footer"
import "./normalize.css"
import "./webflow.css"
import "./meet-berlin-web-page.webflow.css"

const Layout = ({ children, train, heading, linkbutton }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const title = heading || data.site.siteMetadata.title

  return (
    <>
      <Header siteTitle={title} train={train} linkbutton={linkbutton} />
      {children}
      <Footer />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  train: PropTypes.bool,
  heading: PropTypes.string,
  linkbutton: PropTypes.string,
}

export default Layout
