import React from 'react';
import {defaultProps, propTypes} from './props';
import {ButtonViewWrapper, ButtonText} from './styled';

export const Button = ({buttonText, onPress, backgroundColor, disabled,textColor}) => (
  <ButtonViewWrapper
    disabled={disabled}
    backgroundColor={backgroundColor}
    onPress={() => onPress()}>
    <ButtonText textColor ={textColor}  >{buttonText}</ButtonText>
  </ButtonViewWrapper>
);

Button.defaultProps = defaultProps;
Button.propTypes = propTypes;
