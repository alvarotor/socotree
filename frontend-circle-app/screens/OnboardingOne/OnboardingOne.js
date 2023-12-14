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
import ONBOARDING_ONE from '../components/images/onboarding_one.png';

export const OnboardingOneScreen = ({navigation}) => {
  return (
    <MainViewUpper>
      <InnerGreenViewUpper>
        <BlackLogo backBtn={true} navigation={navigation} />
      </InnerGreenViewUpper>
      <Triangle />
      <InnerViewUpper>
        <CenterImage source={ONBOARDING_ONE} />
        <TextWrapper fontSize={'22px'}>
          <TitleText
            fontSize={'22px'}
            text={'Welcome to Circles! '}
            color="#000"
          />
        </TextWrapper>
        <DescText>
          This is the place to have interesting conversations, meet new people
          and make new friends in Berlin.
        </DescText>
        <SliderCircles count={1} />
        <ButtonWrapper>
          <Button
            textColor={'#000'}
            buttonText="Next"
            onPress={() => navigation.navigate('OnboardingTwo')}
          />
        </ButtonWrapper>
      </InnerViewUpper>
    </MainViewUpper>
  );
};

OnboardingOneScreen.defaultProps = defaultProps;
OnboardingOneScreen.propTypes = propTypes;
