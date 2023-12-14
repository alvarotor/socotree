import React, {useState, useContext, useEffect} from 'react';
import {defaultProps, propTypes} from '../components/propsNavigation';
import {
  ReceiveText,
  IconStyled,
  SendAgainView,
  SendText,
  styles,
} from './styled';
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
import {ScrollView, Alert} from 'react-native';
import {Template} from '../components/keyboard-safe-view';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {UserContext} from '../UserContext';
import {verifyMyEmail, verifyMyEmailCode} from '../../core';
import AsyncStorage from '@react-native-community/async-storage';
import {trackScreen} from '../segment';
import * as CommonActions from '@react-navigation/routers/src/CommonActions';

export const VerificationCodeScreen = ({navigation}) => {
  const {user, setUser} = useContext(UserContext);
  const [code, setCode] = useState('');
  const [submitEnabled, setSubmitEnabled] = useState(false);

  useEffect(() => {
    trackScreen('VerificationCode', user.userid);
  });

  useEffect(() => {
    const verifyEmail = async () => {
      await verifyMyEmail(user.token);
      console.log('email sent');
    };

    if (!user.emailverified) {
      verifyEmail();
    }
  }, [user.emailverified, user.token]);

  const VerifyCode = () => {
    if (!code && code.length < 4) {
      Alert.alert('Verify your email', 'Please, add a code.');
      return;
    }
    if (!submitEnabled) {
      setSubmitEnabled(true);
      verifyMyEmailCode(user.token, code)
        .then(() => {
          Alert.alert('Verify your email', 'Thanks for verifying your email', [
            {
              text: 'OK',
              onPress: async () => {
                const updatedUser = {
                  ...user,
                  emailverified: true,
                };
                setUser(updatedUser);
                await AsyncStorage.setItem(
                  'loginUser',
                  JSON.stringify(updatedUser),
                );
                setSubmitEnabled(false);
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Events'}],
                  }),
                );
              },
            },
          ]);
        })
        .catch((error) => {
          console.log(error);
          Alert.alert('Error', 'Please try again ' + error.message);
          setSubmitEnabled(false);
        });
    }
  };

  const reSendMail = () => {
    if (!submitEnabled) {
      setSubmitEnabled(true);
      verifyMyEmail(user.token)
        .then(() => {
          Alert.alert(
            'Verify your email',
            'Email just being resent to you. Please go get the code inside the last email, ' +
              'add it here, and press the continue button below to verify it.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setSubmitEnabled(false);
                  // setShowVerifyEmail(false);
                },
              },
            ],
          );
        })
        .catch((error) => {
          console.log(error);
          Alert.alert('Error', 'Please try again' + error);
        });
    }
  };

  return (
    <Template>
      <MainViewWrapper>
        <AppHeader
          navigation={navigation}
          leftButton={{
            email: true,
          }}
        />
        <InnerView>
          <ScrollView showsVerticalScrollIndicator={false}>
            <InputFieldWrapper>
              <TitleText title={true} text="Verify your email" />
              <Separator />
              <TitleText text={"Please enter the code that we've sent to"} />
              <TitleText text={user.email} fontSize="18px" title={true} />
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
              <ReceiveText>Didn’t receive the code in your email?</ReceiveText>
              <SendAgainView onPress={reSendMail} disabled={submitEnabled}>
                <SendText>Send it again</SendText>
                <IconStyled name="arrowright" />
              </SendAgainView>
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

VerificationCodeScreen.defaultProps = defaultProps;
VerificationCodeScreen.propTypes = propTypes;
