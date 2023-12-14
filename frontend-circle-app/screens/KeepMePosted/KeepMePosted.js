import React from 'react';
import {defaultProps, propTypes} from '../components/propsNavigation';
import {
  InnerGreenViewUpper,
  MainViewUpper,
  CenterImage,
  InnerViewUpper,
  DescText,
  SubText,
  MainText,
} from './styled';
import {Button} from '../components/button';
import {BlackLogo} from '../components/black-logo';
import {ButtonWrapper, Triangle} from '../components/GlobalStyles';
import ONBOARDING_FOUR from '../components/images/keep_me_posted.png';
import * as CommonActions from '@react-navigation/routers/src/CommonActions';
import {TouchableOpacity} from 'react-native';
import StatusBarColor from '../components/statusBar';
import {
  requestUserPNPermissionAsync,
  configureOnNotificationOpenedApp,
  configureGetInitialNotification,
} from '../notifications';

export const KeepMePostedScreen = ({navigation}) => {
  return (
    <>
      <StatusBarColor backgroundColor="#f2fff2" />
      <MainViewUpper>
        <InnerGreenViewUpper>
          <BlackLogo backBtn={true} navigation={navigation} color={'#000000'} />
        </InnerGreenViewUpper>
        <CenterImage source={ONBOARDING_FOUR} />
        <Triangle />
        <InnerViewUpper>
          <MainText>Keep me posted</MainText>
          <SubText>Find out when you get a message in the chat</SubText>
          <TouchableOpacity
            onPress={() => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Events'}],
                }),
              );
            }}>
            <DescText>NOT NOW</DescText>
          </TouchableOpacity>
          <ButtonWrapper>
            <Button
              textColor={'#000'}
              buttonText="Next"
              onPress={() => {
                const requestUserPNPermission = async () =>
                  await requestUserPNPermissionAsync();
                const permissionsGranted = requestUserPNPermission();
                if (permissionsGranted) {
                  configureOnNotificationOpenedApp();
                  configureGetInitialNotification();
                }
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Events'}],
                  }),
                );
              }}
            />
          </ButtonWrapper>
        </InnerViewUpper>
      </MainViewUpper>
    </>
  );
};

KeepMePostedScreen.defaultProps = defaultProps;
KeepMePostedScreen.propTypes = propTypes;
