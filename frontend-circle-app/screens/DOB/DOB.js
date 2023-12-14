import React, {useContext, useEffect} from 'react';
import {defaultProps, propTypes} from '../components/props';
import {VerticalWrap, SmallView, LargeView} from './styled';
import {AppHeader} from '../components/app-header';
import {TitleText} from '../components/title-text';
import {Button} from '../components/button';
import {TextInput} from '../components/textinput';
import {
  Separator,
  InputFieldWrapper,
  LineSeparator,
  MainViewWrapper,
  InnerView,
  ButtonWrapper,
  GrayBar,
  GreenBar,
} from '../components/GlobalStyles';
import {updateUserData} from '../../core';
import {Alert, ScrollView} from 'react-native';
import {Template} from '../components/keyboard-safe-view';
import ENV from '../../active.env';
import {UserContext} from '../UserContext';
import {identify, trackScreen} from '../segment';

export const DOBScreen = ({navigation, route}) => {
  const {settings} = route.params;
  const {user, setUser} = useContext(UserContext);

  if (!user || user === {} || !user.token || !user.profile) {
    navigation.navigate('Start');
  }

  useEffect(() => {
    trackScreen('DOB', user.userid);
  });

  const getYear = (year) => {
    if (numbersOnly(year)) {
      user.profile.ageyear = parseInt(year, 10);
    }
  };

  const getMonth = (month) => {
    if (numbersOnly(month)) {
      user.profile.agemonth = parseInt(month, 10);
    }
  };

  const getDay = (day) => {
    if (numbersOnly(day)) {
      user.profile.ageday = parseInt(day, 10);
    }
  };

  const numbersOnly = (e) => {
    return /^\d+$/.test(e.toString()) ? true : false;
  };

  return (
    <Template>
      <MainViewWrapper>
        {!settings ? (
          <GrayBar>
            <GreenBar width={(100 / 6) * 2} />
          </GrayBar>
        ) : null}
        <AppHeader navigation={navigation} />
        <InnerView>
          <ScrollView showsVerticalScrollIndicator={false}>
            <InputFieldWrapper>
              <TitleText
                title={true}
                text="Please enter your birthday"
                fontSize={'40px'}
              />
              <TitleText text="dd/mm/yyyy" fontSize={'15px'} />
              <VerticalWrap>
                <SmallView>
                  <TextInput
                    maxLength={2}
                    placeholder="DD"
                    textAlign={'center'}
                    onChangeText={getDay}
                    value={
                      user.profile.ageday === 0
                        ? ''
                        : user.profile.ageday.toString()
                    }
                    keyboardType={'numeric'}
                    autoFocus={true}
                    selectTextOnFocus={true}
                  />
                  <LineSeparator />
                </SmallView>
                <Separator>/</Separator>
                <SmallView>
                  <TextInput
                    maxLength={2}
                    placeholder="MM"
                    textAlign={'center'}
                    onChangeText={getMonth}
                    value={
                      user.profile.agemonth === 0
                        ? ''
                        : user.profile.agemonth.toString()
                    }
                    keyboardType={'numeric'}
                    selectTextOnFocus={true}
                  />
                  <LineSeparator />
                </SmallView>
                <Separator>/</Separator>
                <LargeView>
                  <TextInput
                    maxLength={4}
                    placeholder="YYYY"
                    textAlign={'center'}
                    onChangeText={getYear}
                    value={
                      user.profile.ageyear === 0
                        ? ''
                        : user.profile.ageyear.toString()
                    }
                    keyboardType={'numeric'}
                    selectTextOnFocus={true}
                  />
                  <LineSeparator />
                </LargeView>
              </VerticalWrap>
            </InputFieldWrapper>
          </ScrollView>
          <ButtonWrapper>
            <Button
              buttonText="Continue"
              onPress={async () => {
                if (
                  (user.profile.ageyear > new Date().getFullYear() ||
                    user.profile.ageyear < 1920 ||
                    user.profile.agemonth < 1 ||
                    user.profile.agemonth > 12 ||
                    user.profile.ageday < 1 ||
                    user.profile.ageday > 31) &&
                  ENV !== 'dev'
                ) {
                  Alert.alert(
                    'Date of birth',
                    'Sorry, but the birthday date is invalid',
                  );
                  return;
                }
                user.profile = await updateUserData(user);
                setUser(user);
                await identify(user.userid, user.email, user.profile);
                if (settings) {
                  navigation.navigate('EditProfile');
                } else {
                  navigation.navigate('District', {settings: false});
                }
              }}
            />
          </ButtonWrapper>
        </InnerView>
      </MainViewWrapper>
    </Template>
  );
};

DOBScreen.defaultProps = defaultProps;
DOBScreen.propTypes = propTypes;
