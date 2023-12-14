import React from "react"
import PropTypes from "prop-types"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Rectangle2 from "../components/indexImages/howItWorks/rectangle2"
import Rectangle3 from "../components/indexImages/howItWorks/rectangle3"
import Rectangle4 from "../components/indexImages/howItWorks/rectangle4"
import SEO from "../components/seo"

export const IndexPageTemplate = ({ howitworks, faq }) => (
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
      <h5 id="howitworks" className="heading">
        FREQUENTLY ASKED QUESTIONS
      </h5>
      <div className="content-wrapper slim w-container">
        <div className="header-center-box _75"></div>
        <div className="accordion-wrapper">
          {faq.map(q => (
            <div className="accordion-item">
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

IndexPageTemplate.propTypes = {
  howitworks: PropTypes.object, 
  faq: PropTypes.array, 
}

const IndexPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark

  return (
    <Layout heading={frontmatter.heading}>
      <IndexPageTemplate
        howitworks={frontmatter.howitworks}
        faq={frontmatter.faq}
      />
    </Layout>
  )
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}

export default IndexPage

export const pageQuery = graphql`
  query IndexPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
      frontmatter {
        heading
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
