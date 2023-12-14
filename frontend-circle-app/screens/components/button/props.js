import PropTypes from 'prop-types';

export const propTypes = {
  buttonText: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  backgroundColor: PropTypes.string,
  disabled: PropTypes.bool,
};

export const defaultProps = {
  backgroundColor: '',
  buttonText: '',
  onPress: {},
  disabled: false,
};
