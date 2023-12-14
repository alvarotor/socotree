import React from 'react';
import {defaultProps, propTypes} from '../components/propsNavigation';
import {
  InnerGreenViewUpper,
  Triangle,
  MainViewUpper,
  CenterImage,
  InnerViewUpper,
  DescText,
} from './styled';
import {Button} from '../components/button';
import {BlackLogo} from '../components/black-logo';
import {TextWrapper, ButtonWrapper} from '../components/GlobalStyles';
import {TitleText} from '../components/title-text';
import {SliderCircles} from '../components/slider-circles';
import ONBOARDING_THREE from '../components/images/onboarding_three.png';

export const OnboardingThreeScreen = ({navigation}) => {
  return (
    <MainViewUpper>
      <InnerGreenViewUpper>
        <BlackLogo backBtn={true} navigation={navigation} />
      </InnerGreenViewUpper>
      <Triangle />
      <InnerViewUpper>
        <CenterImage source={ONBOARDING_THREE} />
        <TextWrapper fontSize={'22px'}>
          <TitleText fontSize={'22px'} text={'Get matched!'} color="#000" />
        </TextWrapper>
        <DescText>
          If you take part in an event, you’ll get matched with the best
          possible group of people who take part in the same event.
        </DescText>

        <SliderCircles count={3} />
        <ButtonWrapper>
          <Button
            textColor={'#000'}
            buttonText="Next"
            onPress={() => {
              navigation.navigate('OnboardingFour');
            }}
          />
        </ButtonWrapper>
      </InnerViewUpper>
    </MainViewUpper>
  );
};

OnboardingThreeScreen.defaultProps = defaultProps;
OnboardingThreeScreen.propTypes = propTypes;
