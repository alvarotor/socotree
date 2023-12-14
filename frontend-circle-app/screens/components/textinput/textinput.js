import React from 'react';
import {defaultProps, propTypes} from './props';
import {TextInputWrapper} from './styled';

export const TextInput = ({
  placeholder,
  textAlign,
  maxLength,
  onChangeText,
  value,
  backgroundColor,
  keyboardType,
  autoFocus,
  autoCapitalize,
  secureTextEntry,
  selectTextOnFocus,
}) => {
  return (
    <TextInputWrapper
      onChangeText={onChangeText}
      defaultValue={value}
      placeholder={placeholder}
      backgroundColor={backgroundColor}
      textAlign={textAlign}
      maxLength={maxLength}
      keyboardType={keyboardType}
      autoFocus={autoFocus}
      autoCapitalize={autoCapitalize}
      secureTextEntry={secureTextEntry}
      selectTextOnFocus={selectTextOnFocus}
    />
  );
};

TextInput.defaultProps = defaultProps;
TextInput.propTypes = propTypes;
