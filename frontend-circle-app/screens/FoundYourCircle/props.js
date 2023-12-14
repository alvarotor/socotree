import PropTypes from 'prop-types';

export const propTypes = {
  navigation: PropTypes.object,
  users: PropTypes.array,
  circles: PropTypes.array,
  onToggleFoundYourCirclesModal: PropTypes.func,
};

export const defaultProps = {
  navigation: {},
  users: [],
  circles: [],
  onToggleFoundYourCirclesModal: () => {},
};
