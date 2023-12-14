import PropTypes from 'prop-types';

export const propTypes = {
  backgroundColor: PropTypes.string,
  title: PropTypes.string,
  time: PropTypes.string,
};

export const defaultProps = {
  backgroundColor: 'white',
  title: '',
  time: '00:00',
};
