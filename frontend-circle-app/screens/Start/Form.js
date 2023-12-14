import React, {useState, useContext} from 'react';
import {Formik} from 'formik';
import {updateUserData, logIn, existUser, create} from '../../core';
import {
  Modal,
  TouchableHighlight,
  Alert,
  ScrollView,
  Text,
  Platform,
} from 'react-native';
import {
  Separator,
  InputFieldWrapper,
  LineSeparator,
  MainViewWrapper,
  ButtonWrapper,
  InnerView,
  CrossIconStyled,
  CrossIconContainerStyled,
} from '../components/GlobalStyles';
import {
  CheckboxWrapper,
  ImageWrapper,
  Image,
  ImageOut,
  AgreementTextWrapper,
} from './styled';
import {TitleText} from '../components/title-text';
import {TextInput} from '../components/textinput';
import {Template} from '../components/keyboard-safe-view';
import {Button} from '../components/button';
import crashlytics from '@react-native-firebase/crashlytics';
import * as CommonActions from '@react-navigation/routers/src/CommonActions';
import {UserContext} from '../UserContext';
import AsyncStorage from '@react-native-community/async-storage';
import ENV from '../../active.env';
import {identify, track} from '../segment';

export const Form = ({
  navigation,
  login,
  modal,
  setModal,
  emailAdmin,
  setDialogForgotten,
}) => {
  const {setUser} = useContext(UserContext);

  const [isNewsUpdated, setNewsUpdated] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(false);

  const toggleNewsUpdated = () => setNewsUpdated(!isNewsUpdated);

  const forwardScreen = async (u) => {
    setUser(u);
    // if (u.profile.adminverified) {
    const fcmToken = await AsyncStorage.getItem('fcmToken');
    if (u.profile.fcmtoken !== fcmToken) {
      u.profile = await updateUserData(u);
      setUser(u);
      await identify(u.userid, u.email, u.profile);
      console.log(Platform.OS, 'fcmtoken updated');
    }
    // console.log("profile", u.profile);
    // console.log("admin", u.profile.admin);
    if (!u.emailverified) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'VerificationCode'}],
        }),
      );
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Events'}],
        }),
      );
    }
    // } else {
    //   if (!u.emailverified) {
    //     navigation.dispatch(
    //       CommonActions.reset({
    //         index: 0,
    //         routes: [{name: 'VerificationCode'}],
    //       }),
    //     );
    //   } else {
    //     if (
    //       u.profile.name &&
    //       u.profile.ageyear &&
    //       u.profile.agemonth &&
    //       u.profile.ageday &&
    //       u.profile.district > 0 &&
    //       u.profile.logged
    //     ) {
    //       navigation.dispatch(
    //         CommonActions.reset({
    //           index: 0,
    //           routes: [{name: 'YouAreListed'}],
    //         }),
    //       );
    //     } else {
    //       navigation.dispatch(
    //         CommonActions.reset({
    //           index: 0,
    //           routes: [{name: 'FirstName'}],
    //         }),
    //       );
    //     }
    //   }
    // }
  };

  const onSubmit = async (values) => {
    let {email, password} = values;
    let data;
    email = email.trim().toLowerCase();
    if (email.length === 0 || password.length === 0) {
      Alert.alert('Circles', 'Sorry, you must provide email and password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Circles', 'Sorry, your password is too short.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Circles', 'Sorry, your email is incorrect.');
      return;
    }
    try {
      crashlytics().log('Submit Start Form');
      setSubmitEnabled(true);
      if (login) {
        data = await logIn(email, password);
        data.profile.logged = true;
        await updateUserData(data);
        await identify(data.userid, data.email, data.profile);
        setModal(false);
        forwardScreen(data);
      } else {
        if (await existUser(email)) {
          Alert.alert('Register', 'Sorry, that email was already used.');
          setSubmitEnabled(false);
          return;
        }
        data = await create(email, password);
        await track('Submit Start Register Form', data.userid);
        if (data) {
          Alert.alert('Register', 'Email registered ' + email, [
            {
              text: 'OK',
              onPress: async () => {
                const u = await logIn(email, password);
                u.profile.login = 'email';
                u.profile.pushnotificationswitch = true;
                u.profile.emailsswitch = true;
                u.profile.logged = true;
                u.profile.newsupdate = isNewsUpdated;
                await updateUserData(u);
                await identify(u.userid, u.email, u.profile);
                setModal(false);
                forwardScreen(u);
              },
            },
          ]);
        } else {
          setSubmitEnabled(false);
          Alert.alert(
            'Circles',
            'Sorry, theres been an error. ' + data.message,
          );
        }
      }
      await Promise.all([
        crashlytics().setUserId(data.userid ? data.userid : email),
        crashlytics().setAttribute('email', email),
        crashlytics().setAttributes({
          username: data.profile?.name ? data.profile?.name : '',
          login: 'email',
        }),
      ]);
      setSubmitEnabled(false);
    } catch (err) {
      console.log(err?.message);
      Alert.alert('Register / Login', err?.message);
      track('ERROR Submit Start Form', {
        message: JSON.stringify(err),
      });
      setSubmitEnabled(false);
      if (err?.message) {
        crashlytics().recordError(new Error(err.message));
      }
    }
  };

  return (
    <Modal animationType="fade" visible={modal}>
      <Formik
        initialValues={{
          email: ENV === 'dev' ? emailAdmin : '',
          password: ENV === 'dev' ? '123456' : '',
        }}
        onSubmit={onSubmit}>
        {({handleSubmit, handleChange, handleBlur, values}) => (
          <Template>
            <MainViewWrapper>
              <CrossIconContainerStyled>
                <TouchableHighlight
                  underlayColor="#ffffff00"
                  onPress={() => setModal(!modal)}>
                  <CrossIconStyled name={'closecircle'} />
                </TouchableHighlight>
              </CrossIconContainerStyled>
              <InnerView>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <InputFieldWrapper>
                    <TitleText text="What is your email?" fontSize={'40px'} />
                    <TextInput
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      placeholder={'email'}
                      value={values.email}
                      autoFocus={true}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                    <LineSeparator />
                    <Separator />
                    <TitleText text="Password?" fontSize={'40px'} />
                    <TextInput
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      placeholder={'password'}
                      value={values.password}
                      autoCapitalize="none"
                      secureTextEntry={true}
                    />
                    <LineSeparator />
                  </InputFieldWrapper>
                  {login ? (
                    <>
                      <Separator />
                      <TouchableHighlight
                        underlayColor="#ffffff00"
                        onPress={() => {
                          setModal(!modal);
                          setDialogForgotten(true);
                        }}>
                        <Text>Forgot password?</Text>
                      </TouchableHighlight>
                      <Separator />
                    </>
                  ) : (
                    <CheckboxWrapper>
                      <ImageWrapper
                        onPress={toggleNewsUpdated}
                        activeOpacity={0.4}>
                        {isNewsUpdated && (
                          <ImageOut>
                            <Image
                              source={require('../components/images/Vector.png')}
                            />
                          </ImageOut>
                        )}
                      </ImageWrapper>
                      <AgreementTextWrapper>
                        <TitleText
                          text="I agree to receive community updates, news and updates from Circles."
                          fontSize={'14px'}
                          color={'grey'}
                        />
                      </AgreementTextWrapper>
                    </CheckboxWrapper>
                  )}
                </ScrollView>
                <ButtonWrapper>
                  <Button
                    disabled={submitEnabled}
                    onPress={handleSubmit}
                    buttonText={login ? 'Log In' : 'Register'}
                  />
                </ButtonWrapper>
              </InnerView>
            </MainViewWrapper>
          </Template>
        )}
      </Formik>
    </Modal>
  );
};
