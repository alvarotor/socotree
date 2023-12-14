import React from 'react';
import {defaultProps, propTypes} from './props';
import {
  MainViewWrapper,
  MainViewWrapperMain,
  ImageWrapperProfile,
  ImageWrapperOut,
  HeaderText,
  IconStyled,
  ContentWrapper,
  ButtonWrapper,
  IconEntypoStyled,
  StatusBarWrapper,
} from './styled';
import {View} from 'react-native';
import StatusBarColor from '../statusBar';
import * as CommonActions from '@react-navigation/routers/src/CommonActions';
import AsyncStorage from '@react-native-community/async-storage';

const iconsEntypo = ['log-out'];

export const AppHeader = ({
  showHeaderText = false,
  headerText,
  navigation,
  leftButton,
  rightButton,
  backgroundColor,
}) => {
  const renderRightButton = () => {
    return rightButton.imageUrl ? (
      <ImageWrapperOut onPress={() => navigation.navigate('Profile')}>
        {rightButton.imageUrl === 'test' ? (
          <ImageWrapperProfile source={require('../images/test.jpg')} />
        ) : (
          <ImageWrapperProfile source={{uri: rightButton.imageUrl}} />
        )}
      </ImageWrapperOut>
    ) : (
      <ButtonWrapper onPress={rightButton.onPress}>
        {iconsEntypo.find((item) => item === rightButton.iconName) ? (
          <IconEntypoStyled name={rightButton.iconName} />
        ) : (
          <IconStyled name={rightButton.iconName} />
        )}
      </ButtonWrapper>
    );
  };

  const rightButtonIsHidden = !rightButton.imageUrl && !rightButton.iconName;

  const renderHeader = () => {
    return (
      <View>
        <StatusBarWrapper>
          <StatusBarColor backgroundColor={backgroundColor} />
        </StatusBarWrapper>
        <ContentWrapper>
          {leftButton.isHidden ? (
            <ButtonWrapper />
          ) : leftButton.setting ? (
            <ButtonWrapper onPress={() => navigation.navigate('Settings')}>
              <IconStyled name="setting" />
            </ButtonWrapper>
          ) : leftButton.email ? (
            <ButtonWrapper
              onPress={async () => {
                await AsyncStorage.removeItem('loginUser');
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Start'}],
                  }),
                );
              }}>
              <IconStyled name="arrowleft" />
            </ButtonWrapper>
          ) : (
            <ButtonWrapper onPress={() => navigation.pop()}>
              <IconStyled name="arrowleft" />
            </ButtonWrapper>
          )}
          {showHeaderText && <HeaderText>{headerText}</HeaderText>}
          {!rightButtonIsHidden ? renderRightButton() : <ButtonWrapper />}
        </ContentWrapper>
      </View>
    );
  };

  if (backgroundColor !== 'white') {
    return <MainViewWrapper>{renderHeader()}</MainViewWrapper>;
  } else {
    return <MainViewWrapperMain>{renderHeader()}</MainViewWrapperMain>;
  }
};

AppHeader.defaultProps = defaultProps;
AppHeader.propTypes = propTypes;
