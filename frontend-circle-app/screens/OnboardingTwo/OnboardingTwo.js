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
import ONBOARDING_TWO from '../components/images/onboarding_two.png';

export const OnboardingTwoScreen = ({navigation}) => {
  return (
    <MainViewUpper>
      <InnerGreenViewUpper>
        <BlackLogo backBtn={true} navigation={navigation} />
      </InnerGreenViewUpper>
      <Triangle />
      <InnerViewUpper>
        <CenterImage source={ONBOARDING_TWO} />
        <TextWrapper fontSize={'22px'}>
          <TitleText fontSize={'22px'} text={'Join an event'} color="#000" />
        </TextWrapper>
        <DescText>To meet new people, join an event!</DescText>

        <SliderCircles count={2} />
        <ButtonWrapper>
          <Button
            textColor={'#000'}
            buttonText="Next"
            onPress={() => {
              navigation.navigate('OnboardingThree');
            }}
          />
        </ButtonWrapper>
      </InnerViewUpper>
    </MainViewUpper>
  );
};

OnboardingTwoScreen.defaultProps = defaultProps;
OnboardingTwoScreen.propTypes = propTypes;
