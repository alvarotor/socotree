import React, {useContext, useEffect} from 'react';
import {defaultProps, propTypes} from '../components/props';
import {AppHeader} from '../components/app-header';
import {TitleText} from '../components/title-text';
import {Button} from '../components/button';
import {TextInput} from '../components/textinput';
import {
  InputFieldWrapper,
  LineSeparator,
  MainViewWrapper,
  ButtonWrapper,
  InnerView,
  GrayBar,
  GreenBar,
} from '../components/GlobalStyles';
import {updateUserData} from '../../core';
import {Alert, ScrollView} from 'react-native';
import {Template} from '../components/keyboard-safe-view';
import ENV from '../../active.env';
import {UserContext} from '../UserContext';
import {identify, trackScreen} from '../segment';

export const FirstNameScreen = ({navigation, route}) => {
  const {settings} = route.params;
  const {user, setUser} = useContext(UserContext);

  if (!user || user === {} || !user.token || !user.profile) {
    navigation.navigate('Start');
  }

  useEffect(() => {
    trackScreen('FirstName', user.userid);
  });

  const getName = (name) => {
    user.profile.name = name;
  };

  return (
    <Template>
      <MainViewWrapper>
        {!settings ? (
          <GrayBar>
            <GreenBar width={(100 / 6) * 1} />
          </GrayBar>
        ) : null}
        <AppHeader navigation={navigation} />
        <InnerView>
          <ScrollView showsVerticalScrollIndicator={false}>
            <InputFieldWrapper>
              <TitleText
                title={true}
                text="What is your first name?"
                fontSize={'40px'}
              />
              <TextInput
                maxLength={20}
                onChangeText={getName}
                value={user.profile.name}
                autoFocus={true}
              />
              <LineSeparator />
            </InputFieldWrapper>
          </ScrollView>
          <ButtonWrapper>
            <Button
              buttonText="Continue"
              onPress={async () => {
                if (
                  (!user.profile.name || user.profile.name.trim().length < 3) &&
                  ENV !== 'dev'
                ) {
                  Alert.alert(
                    'First Name',
                    'Sorry, but the name is mandatory and should be longer than 2 characters and less than 20',
                  );
                  return;
                }
                const updatedUser = {
                  ...user,
                  profile: await updateUserData(user),
                };
                setUser(updatedUser);
                await identify(user.userid, user.email, updatedUser.profile);
                if (settings) {
                  navigation.navigate('EditProfile');
                } else {
                  navigation.navigate('DOB', {settings: false});
                }
              }}
            />
          </ButtonWrapper>
        </InnerView>
      </MainViewWrapper>
    </Template>
  );
};

FirstNameScreen.defaultProps = defaultProps;
FirstNameScreen.propTypes = propTypes;
