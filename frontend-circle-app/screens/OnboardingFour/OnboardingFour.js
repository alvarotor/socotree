import React from 'react';
import {defaultProps, propTypes} from '../components/propsNavigation';

import {
  InnerGreenViewUpper,
  MainViewUpper,
  CenterImage,
  InnerViewUpper,
  DescText,
} from './styled';
import {Button} from '../components/button';
import {BlackLogo} from '../components/black-logo';
import {TextWrapper, ButtonWrapper, Triangle} from '../components/GlobalStyles';
import {TitleText} from '../components/title-text';
import {SliderCircles} from '../components/slider-circles';
import ONBOARDING_FOUR from '../components/images/onboarding_four.png';

export const OnboardingFourScreen = ({navigation}) => {
  return (
    <MainViewUpper>
      <InnerGreenViewUpper>
        <BlackLogo backBtn={true} navigation={navigation} />
      </InnerGreenViewUpper>
      <Triangle />
      <InnerViewUpper>
        <CenterImage source={ONBOARDING_FOUR} />
        <TextWrapper fontSize={'22px'}>
          <TitleText
            fontSize={'22px'}
            text={'Meet amazing people'}
            color="#000"
          />
        </TextWrapper>
        <DescText>Chat, videocall, or meet your matches in person!</DescText>

        <SliderCircles count={4} />
        <ButtonWrapper>
          <Button
            textColor={'#000'}
            buttonText="Get started"
            onPress={() => {
              navigation.navigate('Start');
            }}
          />
        </ButtonWrapper>
      </InnerViewUpper>
    </MainViewUpper>
  );
};

OnboardingFourScreen.defaultProps = defaultProps;
OnboardingFourScreen.propTypes = propTypes;
