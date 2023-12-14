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
} from '../components/GlobalStyles';
import {updateUserData} from '../../core';
import {Alert, ScrollView, Keyboard} from 'react-native';
import {Template} from '../components/keyboard-safe-view';
import ENV from '../../active.env';
import {UserContext} from '../UserContext';
import {identify, trackScreen} from '../segment';

export const ProfessionScreen = ({navigation, route}) => {
  const {settings} = route.params;
  const {user, setUser} = useContext(UserContext);

  if (!user || user === {} || !user.token || !user.profile) {
    navigation.navigate('Start');
  }

  useEffect(() => {
    trackScreen('Profession', user.userid);
  });

  const getProfession = (profession) => {
    user.profile.profession = profession;
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
                text="What is your profession?"
                fontSize={'40px'}
              />
              <TextInput
                onChangeText={getProfession}
                value={user.profile.profession}
                autoFocus={true}
                maxLength={30}
              />
              <LineSeparator />
            </InputFieldWrapper>
          </ScrollView>
          <ButtonWrapper>
            <Button
              buttonText="Continue"
              onPress={async () => {
                if (
                  (!user.profile.profession ||
                    user.profile.profession.trim().length < 2 ||
                    user.profile.profession.trim().length > 30) &&
                  ENV !== 'dev'
                ) {
                  Alert.alert(
                    'Profession',
                    'Sorry, but the profession is mandatory and should be longer than 1 character and less than 30',
                  );
                  return;
                }
                user.profile = await updateUserData(user);
                setUser(user);
                await identify(user.userid, user.email, user.profile);
                if (settings) {
                  navigation.navigate('EditProfile');
                } else {
                  Keyboard.dismiss();
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

ProfessionScreen.defaultProps = defaultProps;
ProfessionScreen.propTypes = propTypes;
