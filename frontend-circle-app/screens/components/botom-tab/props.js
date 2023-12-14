import PropTypes from 'prop-types';

export const propTypes = {
  isEvents: PropTypes.bool,
  isMyEvents: PropTypes.bool,
  isProfile: PropTypes.bool,
  isChat: PropTypes.bool,
  isContact: PropTypes.bool,
  navigation: PropTypes.object,
};

export const defaultProps = {
  isEvents: false,
  isMyEvents: false,
  isProfile: false,
  isChat: false,
  isContact: false,
  navigation: {},
};
