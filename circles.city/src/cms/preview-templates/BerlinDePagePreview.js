import React from 'react'
import PropTypes from 'prop-types'
import { BerlinDePageTemplate } from '../../templates/berlinde-page'

const BerlinDePagePreview = ({ entry, getAsset }) => {
  const data = entry.getIn(['data']).toJS()

  if (data) {
    return (
      <BerlinDePageTemplate
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

BerlinDePagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  getAsset: PropTypes.func,
}

export default BerlinDePagePreview
