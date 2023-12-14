import React from 'react'
import PropTypes from 'prop-types'
import { DatenschutzerklarungPageTemplate } from '../../templates/datenschutzerklarung-page'

const DatenschutzerklarungPagePreview = ({ entry, widgetFor }) => (
  <DatenschutzerklarungPageTemplate
    title={entry.getIn(['data', 'title'])}
    content={widgetFor('body')}
  />
)

DatenschutzerklarungPagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default DatenschutzerklarungPagePreview
