import React, {useState, useContext, useEffect} from 'react';
import {defaultProps, propTypes} from '../components/propsNavigation';
import {Alert} from 'react-native';
import {TextInput} from '../components/textinput';
import {ScreenHeaderShape} from '../components/screen-header-shape';
import {Button} from '../components/button';
import {changePassword, logOut} from '../../core';
import ENV from '../../active.env';
//import crashlytics from '@react-native-firebase/crashlytics';
import {
  SafeAreaViewWrapper,
  Body,
  SafeAreaViewWrapperBottom,
  ListSection,
  LineSeparator,
  Separator,
  SectionTitle,
  ButtonWrapper,
} from '../components/GlobalStyles';
import {ButtonNarrower} from './styled';
import {UserContext} from '../UserContext';
import {AppHeader} from '../components/app-header';
import {identify, trackScreen, track} from '../segment';

export const PasswordScreen = ({navigation}) => {
  const {user, setUser} = useContext(UserContext);

  if (!user || user === {} || !user.token || !user.profile) {
    navigation.navigate('Start');
  }

  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  useEffect(() => {
    trackScreen('Password', user.userid);
  });

  const changePasswordButton = async (inputText) => {
    try {
      // crashlytics().log('changePassword');
      const response = await changePassword(inputText, user.token);
      if (response) {
        await logOut(setUser, user).then(async () => {
          await identify(user.userid, user.email, user.profile);
          Alert.alert('Change Password', 'Password changed', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Start'),
            },
          ]);
        });
      } else {
        throw new Error('User cant change password');
      }
    } catch (err) {
      if (err) {
        // crashlytics().recordError(new Error(err));
        track('ERROR changePassword', {message: JSON.stringify(err)});
      }
      Alert.alert('Change Password Error', err.message);
    }
  };

  return (
    <SafeAreaViewWrapper>
      <AppHeader navigation={navigation} backgroundColor={'#f2fff2'} />
      <ScreenHeaderShape titleText={'Password'} />
      <SafeAreaViewWrapperBottom>
        <Body>
          <ListSection>
            <SectionTitle>NEW PASSWORD</SectionTitle>
            <TextInput
              placeholder="Your new password..."
              value={ENV === 'dev' && !password ? '123456' : password}
              onChangeText={(input) => setPassword(input)}
              defaultValue={password}
              autoFocus={true}
              autoCapitalize="none"
              secureTextEntry={true}
            />
            <LineSeparator />
            <Separator />
          </ListSection>
          <ListSection>
            <SectionTitle>REPEAT NEW PASSWORD</SectionTitle>
            <TextInput
              placeholder="Re-enter your new password..."
              value={ENV === 'dev' && !password ? '123456' : ''}
              onChangeText={(input) => setPassword2(input)}
              defaultValue={password2}
              autoCapitalize="none"
              secureTextEntry={true}
            />
            <LineSeparator />
            <Separator />
          </ListSection>
        </Body>
        <ButtonNarrower>
          <ButtonWrapper>
            <Button
              buttonText="Update Password"
              onPress={() => {
                if (!password || !password2 || password !== password2) {
                  Alert.alert(
                    'Password Change',
                    'Sorry, passwords are not the same.',
                  );
                  return;
                }
                if (password.length < 6) {
                  Alert.alert(
                    'Password Change',
                    'Sorry, passwords must have six characters minimun',
                  );
                  return;
                }
                changePasswordButton(password);
              }}
            />
          </ButtonWrapper>
        </ButtonNarrower>
      </SafeAreaViewWrapperBottom>
    </SafeAreaViewWrapper>
  );
};

PasswordScreen.defaultProps = defaultProps;
PasswordScreen.propTypes = propTypes;
