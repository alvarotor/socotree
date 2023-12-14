import React from 'react';
import {defaultProps, propTypes} from './props';
import {SliderRowWrapper, GreenCircle} from './styled';

export const SliderCircles = ({count}) => {
  return (
    <SliderRowWrapper>
      <GreenCircle color={count == 1 ? '#05EA00' : 'transparent'} />
      <GreenCircle color={count == 2 ? '#05EA00' : 'transparent'} />
      <GreenCircle color={count == 3 ? '#05EA00' : 'transparent'} />
      <GreenCircle color={count == 4 ? '#05EA00' : 'transparent'} />
    </SliderRowWrapper>
  );
};
SliderCircles.defaultProps = defaultProps;
SliderCircles.propTypes = propTypes;
