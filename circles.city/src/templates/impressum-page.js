import React from "react"
import PropTypes from "prop-types"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Content, { HTMLContent } from "../components/content"

export const ImpressumPageTemplate = ({ title, content, contentComponent }) => {
  const PageContent = contentComponent || Content

  return (
    <div className="section-faq">
      <h2 id="howitworks" className="heading">
        {title}
      </h2>
      <PageContent
        className="content-wrapper slim w-container"
        content={content}
      />
    </div>
  )
}

ImpressumPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
}

const ImpressumPage = ({ data }) => {
  const { markdownRemark: post } = data

  return (
    <Layout train="remove">
      <ImpressumPageTemplate
        contentComponent={HTMLContent}
        title={post.frontmatter.title}
        content={post.html}
      />
    </Layout>
  )
}

ImpressumPage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default ImpressumPage

export const impressumPageQuery = graphql`
  query ImpressumPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
      }
    }
  }
`
