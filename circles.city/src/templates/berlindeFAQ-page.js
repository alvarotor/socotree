import React from "react"
import PropTypes from "prop-types"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

export const BerlinDeFAQPageTemplate = ({ faq }) => (
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

BerlinDeFAQPageTemplate.propTypes = {
  faq: PropTypes.array,
}

const BerlinDeFAQPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark

  return (
    <Layout heading={frontmatter.heading} linkbutton={frontmatter.linkbutton}>
      <BerlinDeFAQPageTemplate
        faq={frontmatter.faq}
      />
    </Layout>
  )
}

BerlinDeFAQPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}

export default BerlinDeFAQPage

export const pageQuery = graphql`
  query BerlinDeFAQPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "berlindeFAQ-page" } }) {
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
