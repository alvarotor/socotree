import React from 'react'
import PropTypes from 'prop-types'
import { BerlinPageTemplate } from '../../templates/berlin-page'

const BerlinPagePreview = ({ entry, getAsset }) => {
  const data = entry.getIn(['data']).toJS()

  if (data) {
    return (
      <BerlinPageTemplate
        heading={data.heading}
        linkbutton={data.linkbutton}
        howitworks={data.howitworks || {}}
        faq={data.faq || [] }
      />
    )
  } else {
    return <div>Loading...</div>
  }
}

BerlinPagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  getAsset: PropTypes.func,
}

export default BerlinPagePreview
