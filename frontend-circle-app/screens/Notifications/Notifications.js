import React, {useState, useContext, useEffect} from 'react';
import {defaultProps, propTypes} from '../components/propsNavigation';
import {Switch} from 'react-native';
import {ScreenHeaderShape} from '../components/screen-header-shape';
import {updateUserData} from '../../core';
import {
  SafeAreaViewWrapper,
  Body,
  ListSection,
  SectionTitle,
  ListText,
} from '../components/GlobalStyles';
import {List} from './styled';
import {UserContext} from '../UserContext';
import {AppHeader} from '../components/app-header';
import {identify, trackScreen} from '../segment';
import {
  requestUserPNPermissionAsync,
  configureOnNotificationOpenedApp,
  configureGetInitialNotification,
} from '../notifications';

export const NotificationsScreen = ({navigation}) => {
  const {user, setUser} = useContext(UserContext);

  if (!user || user === {} || !user.token || !user.profile) {
    navigation.navigate('Start');
  }

  const [isPush, setIsPush] = useState(user.profile.pushnotificationswitch);
  const [isEmail, setIsEmail] = useState(user.profile.emailsswitch);
  const [isNewsUpdate, setNewsUpdate] = useState(user.profile.newsupdate);

  useEffect(() => {
    trackScreen('Notifications', user.userid);
  });

  const togglePush = async () => {
    if (!isPush) {
      const requestUserPNPermission = async () =>
        await requestUserPNPermissionAsync();
      const permissionsGranted = requestUserPNPermission();
      if (permissionsGranted) {
        configureOnNotificationOpenedApp();
        configureGetInitialNotification();
      }
    }
    setIsPush((previousState) => !previousState);
    user.profile.pushnotificationswitch = !isPush;
    user.profile = await updateUserData(user);
    setUser(user);
    await identify(user.userid, user.email, user.profile);
  };

  const toggleEmail = async () => {
    setIsEmail((previousState) => !previousState);
    user.profile.emailsswitch = !isEmail;
    user.profile = await updateUserData(user);
    setUser(user);
    await identify(user.userid, user.email, user.profile);
  };

  const toggleNewsUpdate = async () => {
    setNewsUpdate((previousState) => !previousState);
    user.profile.newsupdate = !isNewsUpdate;
    user.profile = await updateUserData(user);
    setUser(user);
    await identify(user.userid, user.email, user.profile);
  };

  return (
    <SafeAreaViewWrapper>
      <AppHeader navigation={navigation} backgroundColor={'#f2fff2'} />
      <ScreenHeaderShape titleText={'Notifications'} />
      <Body>
        <ListSection>
          <SectionTitle>Account</SectionTitle>
          <List>
            <ListText>
              Receive community updates, news and updates from Circles
            </ListText>
            <Switch
              trackColor={{false: '#E7E7E7', true: '#05EA00'}}
              thumbColor={isNewsUpdate ? '#000000' : '#000000'}
              ios_backgroundColor="#E7E7E7"
              onValueChange={toggleNewsUpdate}
              value={isNewsUpdate}
            />
          </List>
          <List>
            <ListText>
              Receive push notifications for Circles app information, new
              Circles or new messages
            </ListText>
            <Switch
              trackColor={{false: '#E7E7E7', true: '#05EA00'}}
              thumbColor={isPush ? '#000000' : '#000000'}
              ios_backgroundColor="#E7E7E7"
              onValueChange={togglePush}
              value={isPush}
            />
          </List>
          <List>
            <ListText>Receive emails for new Circles</ListText>
            <Switch
              trackColor={{false: '#E7E7E7', true: '#05EA00'}}
              thumbColor={isEmail ? '#000000' : '#000000'}
              ios_backgroundColor="#E7E7E7"
              onValueChange={toggleEmail}
              value={isEmail}
            />
          </List>
        </ListSection>
      </Body>
    </SafeAreaViewWrapper>
  );
};

NotificationsScreen.defaultProps = defaultProps;
NotificationsScreen.propTypes = propTypes;
