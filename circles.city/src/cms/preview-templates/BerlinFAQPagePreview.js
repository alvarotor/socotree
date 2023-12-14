import React from 'react'
import PropTypes from 'prop-types'
import { BerlinFAQPageTemplate } from '../../templates/berlinFAQ-page'

const BerlinFAQPagePreview = ({ entry, getAsset }) => {
  const data = entry.getIn(['data']).toJS()

  if (data) {
    return (
      <BerlinFAQPageTemplate
        faq={data.faq || [] }
      />
    )
  } else {
    return <div>Loading...</div>
  }
}

BerlinFAQPagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  getAsset: PropTypes.func,
}

export default BerlinFAQPagePreview
