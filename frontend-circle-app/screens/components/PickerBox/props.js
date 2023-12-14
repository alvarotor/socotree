import PropTypes from 'prop-types';

export const propTypes = {
  BottomBorderOnly: PropTypes.bool,
  options: PropTypes.array,
  onChange: PropTypes.func,
  value: PropTypes.string,
  image: PropTypes.string,
};

export const defaultProps = {
  BottomBorderOnly: null,
  options: [],
  onChange: {},
  value: '',
  image: '',
};
