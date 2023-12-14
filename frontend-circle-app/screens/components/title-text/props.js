import PropTypes from 'prop-types';

export const propTypes = {
  text: PropTypes.string,
  fontSize: PropTypes.string,
  color: PropTypes.string,
  onPress: PropTypes.func,
  title: PropTypes.bool,
  textAlign: PropTypes.string,
  link: PropTypes.string,
};

export const defaultProps = {
  text: '',
  fontSize: '',
  color: '',
  onPress: () => {},
  title: false,
  textAlign: '',
  link: '',
};
