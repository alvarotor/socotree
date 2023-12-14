import React from "react"
import PropTypes from "prop-types"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

export const BerlinFAQPageTemplate = ({ faq }) => (
  <>
    <SEO title="Circle City - Meet Berlin Web Page" />
    <div className="section-faq">
      <h5 id="howitworks" className="heading">
        FREQUENTLY ASKED QUESTIONS
      </h5>
      <div className="content-wrapper slim w-container">
        <div className="header-center-box _75"></div>
        <div className="accordion-wrapper">
          {faq.map((q, index) => (
            <div className="accordion-item" key={index}>
              <div className="accordion-item-trigger">
                <h4 className="accordion-heading">{q.question}</h4>
              </div>
              <div className="accordion-item-content">
                <p>{q.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
)

BerlinFAQPageTemplate.propTypes = {
  faq: PropTypes.array,
}

const BerlinFAQPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark

  return (
    <Layout heading={frontmatter.heading} linkbutton={frontmatter.linkbutton}>
      <BerlinFAQPageTemplate
        faq={frontmatter.faq}
      />
    </Layout>
  )
}

BerlinFAQPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}

export default BerlinFAQPage

export const pageQuery = graphql`
  query BerlinFAQPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "berlinFAQ-page" } }) {
      frontmatter {
        heading
        linkbutton
        faq {
          question
          answer
        }
      }
    }
  }
`
