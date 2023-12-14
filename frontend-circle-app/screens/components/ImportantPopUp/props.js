import PropTypes from 'prop-types';

export const propTypes = {
  isVisible: PropTypes.bool,
  hideModal: PropTypes.func,
  leaveEvent: PropTypes.func,
  type: PropTypes.string,
};

export const defaultProps = {
  isVisible: false,
  hideModal: () => {},
  leaveEvent: () => {},
  type: '0',
};
