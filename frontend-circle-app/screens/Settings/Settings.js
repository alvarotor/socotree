import React, {useState, useContext, useEffect} from 'react';
import {defaultProps, propTypes} from '../components/propsNavigation';
import {ScreenHeaderShape} from '../components/screen-header-shape';
import {logOut} from '../../core';
import {
  SafeAreaViewWrapper,
  Body,
  ListSection,
  SectionTitle,
  ListText,
  List,
} from '../components/GlobalStyles';
import {UserContext} from '../UserContext';
import {AppHeader} from '../components/app-header';
import * as CommonActions from '@react-navigation/routers/src/CommonActions';
import {DialogDeletePopup} from './dialogDelete';
import {identify, trackScreen} from '../segment';

export const SettingsScreen = ({navigation}) => {
  const {user, setUser} = useContext(UserContext);

  if (!user || user === {} || !user.token || !user.profile) {
    navigation.navigate('Start');
  }

  useEffect(() => {
    trackScreen('Settings', user.userid);
  });

  const [dialogDeleteUser, setDialogDeleteUser] = useState(false);

  const resetStackToStart = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Start'}],
      }),
    );
  };

  const logOutBack = async () => {
    return await logOut(setUser, user)
      .then(async () => {
        await identify(user.userid, user.email, user.profile);
        resetStackToStart();
      })
      .catch((err) => {
        console.log(err);
        resetStackToStart();
      });
  };

  return (
    <>
      <SafeAreaViewWrapper>
        <AppHeader navigation={navigation} backgroundColor={'#f2fff2'} />
        <ScreenHeaderShape titleText={'Settings'} />
        <SafeAreaViewWrapper>
          <Body>
            <ListSection>
              <SectionTitle>Account</SectionTitle>
              <List onPress={() => navigation.navigate('Notifications')}>
                <ListText>Notifications</ListText>
              </List>
              <List onPress={() => navigation.navigate('Password')}>
                <ListText>Change Password</ListText>
              </List>
              <List onPress={() => setDialogDeleteUser(true)}>
                <ListText>Delete Account</ListText>
              </List>
              <List onPress={() => navigation.navigate('BlockedUsers')}>
                <ListText>Blocked Users</ListText>
              </List>
              <List onPress={() => logOutBack()}>
                <ListText>Logout</ListText>
              </List>
            </ListSection>
            <ListSection>
              <SectionTitle>App</SectionTitle>
              <List onPress={() => navigation.navigate('Version')}>
                <ListText>Version</ListText>
              </List>
              <List onPress={() => navigation.navigate('ContactUs')}>
                <ListText>Contact Us</ListText>
              </List>
            </ListSection>
            <ListSection>
              <SectionTitle>Serious Stuff</SectionTitle>
              <List onPress={() => navigation.navigate('TermsOfUse')}>
                <ListText>Privacy Policy & Terms of use</ListText>
              </List>
            </ListSection>
          </Body>
        </SafeAreaViewWrapper>
      </SafeAreaViewWrapper>
      <DialogDeletePopup
        navigation={navigation}
        dialogDeleteUser={dialogDeleteUser}
        setDialogDeleteUser={setDialogDeleteUser}
      />
    </>
  );
};

SettingsScreen.defaultProps = defaultProps;
SettingsScreen.propTypes = propTypes;
