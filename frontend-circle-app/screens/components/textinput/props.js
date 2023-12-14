import PropTypes from 'prop-types';

export const propTypes = {
  placeholder: PropTypes.string,
  textAlign: PropTypes.string,
  maxLength: PropTypes.number,
  onChangeText: PropTypes.func,
  value: PropTypes.any,
  backgroundColor: PropTypes.string,
  keyboardType: PropTypes.string,
  autoFocus: PropTypes.bool,
  autoCapitalize: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  selectTextOnFocus: PropTypes.bool,
};

export const defaultProps = {
  placeholder: '',
  textAlign: '',
  maxLength: null,
  onChangeText: null,
  value: null,
  backgroundColor: '#000000',
  keyboardType: 'default',
  autoFocus: false,
  autoCapitalize: 'sentences',
  secureTextEntry: false,
  selectTextOnFocus: false,
};
