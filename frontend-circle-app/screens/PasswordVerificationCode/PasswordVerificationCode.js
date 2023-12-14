import React, {useState, useEffect} from 'react';
import {defaultProps, propTypes} from '../components/propsNavigation';
import {LineSeparator} from './styled';
import {AppHeader} from '../components/app-header';
import {TitleText} from '../components/title-text';
import {Button} from '../components/button';
import {
  InputFieldWrapper,
  MainViewWrapper,
  InnerView,
  ButtonWrapper,
  Separator,
} from '../components/GlobalStyles';
import {ScrollView, Dimensions, StyleSheet, Alert} from 'react-native';
import {Template} from '../components/keyboard-safe-view';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {verifyPasswordForgottenCode} from '../../core';
import {TextInput} from '../components/textinput';
import {trackScreen} from '../segment';

export const PasswordVerificationCodeScreen = ({navigation}) => {
  const [code, setCode] = useState('');
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [password, setPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');

  useEffect(() => {
    trackScreen('PasswordVerification', '');
  });

  const validateInputs = () => {
    if (code.length < 4) {
      Alert.alert('Forgotten Password', 'Enter your 4 digits code');
      return false;
    }
    if (password.length < 6) {
      Alert.alert(
        'Forgotten Password',
        'Password must be min 6 characters long',
      );
      return false;
    }
    if (password !== reEnterPassword) {
      Alert.alert('Forgotten Password', 'Password Mismatch');
      return false;
    }
    if (reEnterPassword.length < 6) {
      Alert.alert(
        'Forgotten Password',
        'Both passwords must be min 6 characters long',
      );
      return false;
    }
    return true;
  };

  const VerifyCode = () => {
    if (!validateInputs()) {
      return;
    }
    if (!submitEnabled) {
      setSubmitEnabled(true);
      verifyPasswordForgottenCode(code, password)
        .then((data) => {
          console.log(data);
          Alert.alert(
            'Forgotten Password',
            'You can now sign in with your new password',
            [
              {
                text: 'OK',
                onPress: async () => {
                  setSubmitEnabled(false);
                  navigation.goBack();
                },
              },
            ],
          );
        })
        .catch((error) => {
          console.log(error);
          Alert.alert(
            'Error',
            'You have set an incorrect code or theres been a problem. Please try again.',
          );
          setSubmitEnabled(false);
        });
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e);
  };

  const handleReEnterPasswordChange = (e) => {
    setReEnterPassword(e);
  };

  return (
    <Template>
      <MainViewWrapper>
        <AppHeader navigation={navigation} />
        <InnerView>
          <ScrollView showsVerticalScrollIndicator={false}>
            <InputFieldWrapper>
              <TitleText
                title={true}
                text="Enter the code you received"
                fontSize={'40px'}
              />
              <OTPInputView
                style={styles.view}
                pinCount={4}
                code={code}
                onCodeChanged={(c) => setCode(c)}
                autoFocusOnLoad
                editable={true}
                codeInputFieldStyle={styles.codeInputFieldStyle}
                onCodeFilled={(c) => setCode(c)}
              />
              <Separator />
              <TextInput
                secureTextEntry={true}
                placeholder="New Password"
                textAlign={'left'}
                value={password}
                onChangeText={handlePasswordChange}
              />
              <LineSeparator />
              <TextInput
                secureTextEntry={true}
                placeholder="Reenter New Password"
                textAlign={'left'}
                value={reEnterPassword}
                onChangeText={handleReEnterPasswordChange}
              />
              <LineSeparator />
            </InputFieldWrapper>
          </ScrollView>
          <ButtonWrapper>
            <Button
              buttonText="Continue"
              onPress={VerifyCode}
              disabled={submitEnabled}
            />
          </ButtonWrapper>
        </InnerView>
      </MainViewWrapper>
    </Template>
  );
};

const styles = StyleSheet.create({
  view: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeInputFieldStyle: {
    width: Dimensions.get('window').width / 5,
    height: 70,
    borderWidth: 0,
    borderColor: 'black',
    borderBottomWidth: 2,
    color: 'black',
    fontSize: 35,
    fontFamily: 'Roboto-Regular',
  },
});

PasswordVerificationCodeScreen.defaultProps = defaultProps;
PasswordVerificationCodeScreen.propTypes = propTypes;
