import PropTypes from 'prop-types';

export const propTypes = {
  titleText: PropTypes.string,
  navigation: PropTypes.object,
  profile: PropTypes.bool,
};

export const defaultProps = {
  titleText: '',
  navigation: {},
  profile: false,
};
