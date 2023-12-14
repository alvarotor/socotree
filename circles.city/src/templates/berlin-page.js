import React from "react"
import PropTypes from "prop-types"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Rectangle2 from "../components/indexImages/howItWorks/rectangle2"
import Rectangle3 from "../components/indexImages/howItWorks/rectangle3"
import Rectangle4 from "../components/indexImages/howItWorks/rectangle4"
import SEO from "../components/seo"

export const BerlinPageTemplate = ({ howitworks, faq }) => (
  <>
    <SEO title="Circle City - Meet Berlin Web Page" />
    <div className="howitworks">
      <h5 id="howitworks" className="heading dark">
        How it works
      </h5>
      <div className="exactly w-row">
        <div className="w-col w-col-4 w-col-tiny-tiny-stack">
          <Rectangle2 />
          <h1 className="heading-2">{howitworks.title1}</h1>
          <p className="paragraph">{howitworks.description1}</p>
        </div>
        <div className="w-col w-col-4 w-col-tiny-tiny-stack">
          <Rectangle3 />
          <h1 className="heading-2">{howitworks.title2}</h1>
          <p className="paragraph">{howitworks.description2}</p>
        </div>
        <div className="w-col w-col-4 w-col-tiny-tiny-stack">
          <Rectangle4 />
          <h1 className="heading-2">{howitworks.title3}</h1>
          <p className="paragraph">{howitworks.description3}</p>
        </div>
      </div>
    </div>
    <div className="section-faq">
      <a href="#faq" id="faq" name="faq" style={{ visibility: "hidden" }}>
        x
      </a>
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

BerlinPageTemplate.propTypes = {
  howitworks: PropTypes.object,
  faq: PropTypes.array,
}

const BerlinPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark

  return (
    <Layout heading={frontmatter.heading} linkbutton={frontmatter.linkbutton}>
      <BerlinPageTemplate
        howitworks={frontmatter.howitworks}
        faq={frontmatter.faq}
      />
    </Layout>
  )
}

BerlinPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}

export default BerlinPage

export const pageQuery = graphql`
  query BerlinPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "berlin-page" } }) {
      frontmatter {
        heading
        linkbutton
        howitworks {
          title1
          description1
          title2
          description2
          title3
          description3
        }
        faq {
          question
          answer
        }
      }
    }
  }
`
