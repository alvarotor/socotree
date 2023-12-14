import PropTypes from 'prop-types';

export const propTypes = {
  isVisible: PropTypes.bool,
  onPressCross: PropTypes.func,
  users: PropTypes.array,
};

export const defaultProps = {
  isVisible: false,
  onPressCross: () => {},
  users: [],
};
