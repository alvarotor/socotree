import React from 'react';
import {
  MainViewWrapper,
  IconStyled,
  ContentWrapper,
  ButtonWrapper,
  LogoImage,
} from './styled';
import {View} from 'react-native';
import LogoImg from '../images/logo.png';

export const BlackLogo = ({navigation, backBtn}) => {
  const renderContent = () => {
    return (
      <View>
        <ContentWrapper>
          {backBtn && (
            <ButtonWrapper onPress={() => navigation.pop()}>
              <IconStyled name="arrowleft" />
            </ButtonWrapper>
          )}
          <LogoImage source={LogoImg} />
        </ContentWrapper>
      </View>
    );
  };

  return <MainViewWrapper>{renderContent()}</MainViewWrapper>;
};
