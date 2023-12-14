import React from 'react';
import {HeaderContent, TitleTextStyle, Triangle} from './styled';
import {defaultProps, propTypes} from './props';

export const ScreenHeaderShape = ({titleText}) => {
  return (
    <>
      <HeaderContent>
        <TitleTextStyle>{titleText}</TitleTextStyle>
      </HeaderContent>
      <Triangle />
    </>
  );
};

ScreenHeaderShape.defaultProps = defaultProps;
ScreenHeaderShape.propTypes = propTypes;
