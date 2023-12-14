import PropTypes from 'prop-types';

export const propTypes = {
  navigation: PropTypes.object,
  leftButton: PropTypes.shape({
    isHidden: PropTypes.bool,
    iconName: PropTypes.string,
    onPress: PropTypes.func,
  }),
  rightButton: PropTypes.shape({
    iconName: PropTypes.string,
    onPress: PropTypes.func,
    imageUrl: PropTypes.string,
  }),
};

export const defaultProps = {
  navigation: {},
  leftButton: {
    iconName: null,
    isHidden: false,
  },
  rightButton: {},
  backgroundColor: 'white',
};
