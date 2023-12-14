import React, {useEffect, useState, useContext} from 'react';
import {defaultProps, propTypes} from '../components/propsNavigation';
import {ScreenHeaderShape} from '../components/screen-header-shape';
import DeviceInfo from 'react-native-device-info';
import {
  SafeAreaViewWrapper,
  Body,
  ListSection,
  SectionTitle,
  ListText,
} from '../components/GlobalStyles';
import {List} from './styled';
import AsyncStorage from '@react-native-community/async-storage';
import {AppHeader} from '../components/app-header';
import {UserContext} from '../UserContext';
import ENV from '../../active.env';
import {trackScreen} from '../segment';

export const VersionScreen = ({navigation}) => {
  const {user} = useContext(UserContext);
  if (!user || user === {} || !user.token || !user.profile) {
    navigation.navigate('Start');
  }

  const [versionData, setVersionData] = useState({});

  useEffect(() => {
    trackScreen('Version', user.userid);

    let isCancelled = false;
    AsyncStorage.getItem('fcmToken').then((token) => {
      if (!isCancelled) {
        setVersionData({
          email: user.email,
          env: ENV,
          buildNumber: DeviceInfo.getBuildNumber(),
          version: DeviceInfo.getVersion(),
          system: DeviceInfo.getSystemName(),
          bundleID: DeviceInfo.getBundleId(),
          fcmToken: token,
        });
      }
    });
    return () => {
      isCancelled = true;
    };
  });

  return (
    <SafeAreaViewWrapper>
      <AppHeader navigation={navigation} backgroundColor={'#f2fff2'} />
      <ScreenHeaderShape titleText={'Version'} />
      <Body>
        <ListSection>
          <SectionTitle>App Circles</SectionTitle>
          <List>
            <ListText>Email: {versionData.email}</ListText>
          </List>
          <List>
            <ListText>Build: {versionData.buildNumber}</ListText>
          </List>
          <List>
            <ListText>Version: {versionData.version}</ListText>
          </List>
          <List>
            <ListText>Env: {versionData.env}</ListText>
          </List>
          <List>
            <ListText>System: {versionData.system}</ListText>
          </List>
          <List>
            <ListText>BundleID: {versionData.bundleID}</ListText>
          </List>
          {ENV !== 'prod' || user.profile.admin ? (
            <List>
              <ListText>FCMToken: {versionData.fcmToken}</ListText>
            </List>
          ) : null}
        </ListSection>
      </Body>
    </SafeAreaViewWrapper>
  );
};

VersionScreen.defaultProps = defaultProps;
VersionScreen.propTypes = propTypes;
