import React from 'react'
import PropTypes from 'prop-types'
import { BerlinDeFAQPageTemplate } from '../../templates/berlindeFAQ-page'

const BerlinDeFAQPagePreview = ({ entry, getAsset }) => {
  const data = entry.getIn(['data']).toJS()

  if (data) {
    return (
      <BerlinDeFAQPageTemplate
        faq={data.faq || [] }
      />
    )
  } else {
    return <div>Loading...</div>
  }
}

BerlinDeFAQPagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  getAsset: PropTypes.func,
}

export default BerlinDeFAQPagePreview
