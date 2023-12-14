import React, {useContext, useEffect, useState} from 'react';
import {defaultProps, propTypes} from '../components/propsNavigation';
import {ScreenHeaderShape} from '../components/screen-header-shape';
import {
  SafeAreaViewWrapper,
  Body,
  ListSection,
  ListText,
  SectionTitle,
  List,
} from '../components/GlobalStyles';
import {UserContext} from '../UserContext';
import {AppHeader} from '../components/app-header';
import {trackScreen, identify} from '../segment';
import {logOut} from '../../core';
import * as CommonActions from '@react-navigation/routers/src/CommonActions';
import {useUserIsRegistered} from '../components/useUserIsRegistered';
import {DialogDeletePopup} from '../Settings/dialogDelete';

export const EditProfileScreen = ({navigation}) => {
  const {user, setUser} = useContext(UserContext);

  if (!user || user === {} || !user.token || !user.profile) {
    navigation.navigate('Start');
  }

  const [dialogDeleteUser, setDialogDeleteUser] = useState(false);
  const profileDone = useUserIsRegistered(user);

  useEffect(() => {
    trackScreen('EditProfile', user.userid);
  });

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
        <ScreenHeaderShape titleText={'Edit Profile'} />
        <SafeAreaViewWrapper>
          <Body>
            <ListSection>
              <List
                onPress={() =>
                  navigation.navigate('FirstName', {
                    settings: true,
                  })
                }>
                <ListText>First Name</ListText>
              </List>
              <List
                onPress={() =>
                  navigation.navigate('Profession', {
                    settings: true,
                  })
                }>
                <ListText>Profession</ListText>
              </List>
              <List
                onPress={() =>
                  navigation.navigate('District', {
                    settings: true,
                  })
                }>
                <ListText>District</ListText>
              </List>
              {user && user.profile.admin ? (
                <List
                  onPress={() =>
                    navigation.navigate('PhoneNumber', {
                      settings: true,
                    })
                  }>
                  <ListText>Phone Number</ListText>
                </List>
              ) : null}
              <List
                onPress={() =>
                  navigation.navigate('DOB', {
                    settings: true,
                  })
                }>
                <ListText>Date of Birth</ListText>
              </List>
              <List
                onPress={() =>
                  navigation.navigate('UploadPhoto', {
                    settings: true,
                  })
                }>
                <ListText>Profile Photo</ListText>
              </List>
              <List
                onPress={() =>
                  navigation.navigate('Questions', {
                    settings: true,
                  })
                }>
                <ListText>Questions</ListText>
              </List>
              {user && user.profile.admin ? (
                <List
                  onPress={() =>
                    navigation.navigate('PerfectEvening', {
                      settings: true,
                    })
                  }>
                  <ListText>Perfect Evening</ListText>
                </List>
              ) : null}
              <List
                onPress={() =>
                  navigation.navigate('Interests', {
                    settings: true,
                  })
                }>
                <ListText>Interests</ListText>
              </List>
              {user && user.profile.admin ? (
                <List onPress={() => navigation.navigate('UserPlace')}>
                  <ListText>My Location</ListText>
                </List>
              ) : null}
            </ListSection>
            {!profileDone ? (
              <>
                <ListSection>
                  <SectionTitle>App</SectionTitle>
                  <List onPress={() => setDialogDeleteUser(true)}>
                    <ListText>Delete Account</ListText>
                  </List>
                  <List onPress={() => logOutBack()}>
                    <ListText>Logout</ListText>
                  </List>
                </ListSection>
                <ListSection>
                  <SectionTitle>Serious Stuff</SectionTitle>
                  <List onPress={() => navigation.navigate('TermsOfUse')}>
                    <ListText>Privacy Policy & Terms of use</ListText>
                  </List>
                </ListSection>
              </>
            ) : null}
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

EditProfileScreen.defaultProps = defaultProps;
EditProfileScreen.propTypes = propTypes;
