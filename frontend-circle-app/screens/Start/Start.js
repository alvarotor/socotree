import React, {useState, useEffect} from 'react';
import BackgroundImg from '../components/images/login_bg.png';
import {Button} from '../components/button';
import {MainViewWrapper, SafeAreaViewWrapper} from '../components/GlobalStyles';
import {
  MainImage,
  ContentWrapper,
  DiscoveredText,
  SignupText,
  SignupButton,
  ContentContainer,
  BottomText,
  TermsWrapper,
  TermsText,
  ButtonViewWrapper,
  LogoImage,
} from './styled';
import {defaultProps, propTypes} from '../components/propsNavigation';
import {Platform} from 'react-native';
import StatusBarColor from '../components/statusBar';
import {Form} from './Form';
import {DialogForgotten} from './DialogForgotten';
import {trackScreen} from '../segment';
import Toast from 'react-native-toast-message';
import {updateVersion} from '../../core/system';
import DeviceInfo from 'react-native-device-info';

export const StartScreen = ({navigation}) => {
  // const [dialogPhone, setDialogPhone] = useState(false);
  const [modal, setModal] = useState(false);
  const [login, setLogin] = useState(false);
  const [dialogForgotten, setDialogForgotten] = useState(false);
  // const [confirm, setConfirm] = useState(null);
  // const [code, setCode] = useState('');
  const emailAdmin =
    Platform.OS === 'ios' ? 'alvaro@socotree.io' : 'alvaro@mailinator.com';

  useEffect(() => {
    trackScreen('Start', '');
  });

  useEffect(() => {
    const buildNumber = DeviceInfo.getBuildNumber();

    const checkUpdateVersion = async () => {
      const version = await updateVersion();
      if (
        (Platform.OS === 'android' &&
          buildNumber < version.androidbuildforced) ||
        (Platform.OS === 'ios' && buildNumber < version.iosbuildforced)
      ) {
        navigation.navigate('UpdateApp');
      } else if (
        (Platform.OS === 'android' && buildNumber < version.androidbuild) ||
        (Platform.OS === 'ios' && buildNumber < version.iosbuild)
      ) {
        Toast.show({
          text1: 'New update with new features available!',
          text2: 'Please update to the new version as soon as you can.',
        });
      }
    };

    checkUpdateVersion();
  }, [navigation]);

  // const confirmCode = async () => {
  //   try {
  //     crashlytics().log('Submit Phone');
  //     const values = await confirm.confirm(code);
  //     const {uid, phoneNumber} = values.user;
  //     const emailLogin = `${phoneNumber}@phone.io`;
  //     let user;
  //     if (await existUser(emailLogin)) {
  //       user = await logIn(uid, 'PHONE');
  //     } else {
  //       await create(emailLogin, 'PHONE', values);
  //       user = await logIn(uid, 'PHONE');
  //       user.profile = {
  //         ...user.profile,
  //         photo: '',
  //       };
  //       user.profile.login = 'phone';
  //       user.profile = await updateUserData(user);;
  //     }
  //     await AsyncStorage.setItem('loginUser', JSON.stringify(user));
  //     await Promise.all([
  //       crashlytics().setUserId(uid),
  //       crashlytics().setAttribute('email', emailLogin),
  //       crashlytics().setAttributes({
  //         username: user.profile.name,
  //         login: 'phone',
  //       }),
  //     ]);
  //     setConfirm(null);
  //     setCode('');
  //     forwardScreen(user);
  //   } catch (err) {
  //     console.log(err.code);
  //     console.log(err.message);
  //     Alert.alert('Phone Login', err.message);
  //     crashlytics().recordError(err);
  //   }
  // };

  // const loginPhone = async (inputText) => {
  //   try {
  //     console.log(inputText);
  //     if (!inputText) {
  //       Alert.alert('Phone Login', 'Please provide a phone number');
  //       return;
  //     }

  //     console.log('verifyPhoneNumber');
  //     // verifyPhoneNumber(inputText).on('state_changed', (phoneAuthSnapshot) => {
  //     //   console.log('Snapshot state: ', phoneAuthSnapshot.state);
  //     //   Alert.alert('Phone Login', phoneAuthSnapshot.state);
  //     // });

  //     crashlytics().log('Phone Login');
  //     console.log('signInWithPhoneNumber');
  //     signInWithPhoneNumber(inputText).then((res) => {
  //       console.log(JSON.stringify(res));
  //       setDialogPhone(false);
  //       setConfirm(res);
  //     });
  //   } catch (err) {
  //     console.log('err');
  //     Alert.alert(
  //       'Phone Login',
  //       `Code not sent to ${inputText}, ${err.message || JSON.stringify(err)}`,
  //     );
  //     crashlytics().recordError(err);
  //   }
  // };

  return (
    <>
      <DialogForgotten
        navigation={navigation}
        dialogForgotten={dialogForgotten}
        setDialogForgotten={setDialogForgotten}
        emailAdmin={emailAdmin}
      />
      {/* <DialogInput
        isDialogVisible={dialogPhone}
        title={'Whats your phone number?'}
        message={'Type your number here and we will send a code to you.'}
        hintInput={'Your phone number'}
        initValueTextInput={ENV === 'dev' ? '+1 650-555-1234' : ''}
        // initValueTextInput={ENV === 'dev' ? '+44 7444 555666' : ''}
        // initValueTextInput={ENV === 'dev' ? '+49 162 8839036' : ''}
        submitInput={(inputText) => loginPhone(inputText)}
        closeDialog={() => setDialogPhone(false)}
      /> */}
      <StatusBarColor backgroundColor="#d9aa82" />
      <Form
        navigation={navigation}
        login={login}
        modal={modal}
        setModal={setModal}
        emailAdmin={emailAdmin}
        setDialogForgotten={setDialogForgotten}
      />
      <MainViewWrapper>
        <SafeAreaViewWrapper>
          <MainImage source={BackgroundImg} />
          <LogoImage source={require('../components/images/logo.png')} />
          <ContentWrapper>
            <DiscoveredText>Meet your new best friends</DiscoveredText>
            <ContentContainer>
              <Button
                backgroundColor="#FAFF00"
                buttonText="SIGN IN"
                textColor="#010101"
                onPress={() => {
                  setLogin(true);
                  setModal(true);
                }}
              />
              <ButtonViewWrapper
                onPress={() => {
                  setLogin(false);
                  setModal(true);
                }}>
                <SignupText>CREATE ACCOUNT</SignupText>
              </ButtonViewWrapper>
              {/* {!confirm ? (
                <Button
                  buttonText="Login with Phone"
                  onPress={() => setDialogPhone(true)}
                />
              ) : (
                <>
                  <TextInput
                    value={code}
                    backgroundColor={'white'}
                    placeholder={'code'}
                    onChangeText={(text) => setCode(text)}
                  />
                  <Button
                    buttonText="Confirm Code"
                    onPress={() => confirmCode()}
                  />
                </>
              )} */}
              <BottomText>
                By choosing any of the options above you agree with
              </BottomText>
              <SignupButton onPress={() => navigation.navigate('TermsOfUse')}>
                <TermsWrapper>
                  <BottomText>our </BottomText>
                  <TermsText>Terms of Use </TermsText>
                  <BottomText>and </BottomText>
                  <TermsText>Privacy Policy </TermsText>
                </TermsWrapper>
              </SignupButton>
            </ContentContainer>
          </ContentWrapper>
        </SafeAreaViewWrapper>
      </MainViewWrapper>
    </>
  );
};

StartScreen.defaultProps = defaultProps;
StartScreen.propTypes = propTypes;
