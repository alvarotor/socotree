import React, {useState, useContext, useEffect} from 'react';
import {defaultProps, propTypes} from '../components/props';
import {VerticalWrap, SmallView, LargeView} from './styled';
import {
  MainViewWrapper,
  InputFieldWrapper,
  LineSeparator,
  InnerView,
  ButtonWrapper,
  Separator,
} from '../components/GlobalStyles';
import {AppHeader} from '../components/app-header';
import {TitleText} from '../components/title-text';
import {Button} from '../components/button';
import {TextInput} from '../components/textinput';
import {PickerBox} from '../components/PickerBox';
import {updateUserData} from '../../core';
import {Alert, ScrollView} from 'react-native';
import {Template} from '../components/keyboard-safe-view';
import ENV from '../../active.env';
import {UserContext} from '../UserContext';
import {identify, trackScreen} from '../segment';

const codes = [
  {
    label: '+49',
    value: '+49',
    image: 'https://cdn.countryflags.com/thumbs/germany/flag-400.png',
  },
  {
    label: '+1',
    value: '+1',
    image: 'https://cdn.countryflags.com/thumbs/united-kingdom/flag-400.png',
  },
  {
    label: '+34',
    value: '+34',
    image: 'https://cdn.countryflags.com/thumbs/spain/flag-400.png',
  },
];

function findWithAttr(array, attr, value) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i][attr] === value) {
      return i;
    }
  }
  return -1;
}

export const PhoneNumberScreen = ({navigation, route}) => {
  const {settings} = route.params;
  const {user, setUser} = useContext(UserContext);

  if (!user || user === {} || !user.token || !user.profile) {
    navigation.navigate('Start');
  }

  useEffect(() => {
    trackScreen('PhoneNumber', user.userid);
  });

  const [item, setItem] = useState(
    user.profile.phoneprefix
      ? findWithAttr(codes, 'value', user.profile.phoneprefix)
      : 0,
  );

  const onSelectCode = (index) => {
    setItem(index);
  };

  const getPhone = (phone) => {
    user.profile.phone = phone;
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
                text="Enter your phone number"
                fontSize={'40px'}
              />
              <VerticalWrap>
                <SmallView>
                  <PickerBox
                    options={codes}
                    BottomBorderOnly
                    image={codes[item].image}
                    value={codes[item].value}
                    onChange={(index) => onSelectCode(index)}
                  />
                </SmallView>
                <Separator />
                <LargeView>
                  <TextInput
                    onChangeText={getPhone}
                    value={user.profile.phone}
                    keyboardType={'numeric'}
                    autoFocus={true}
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
                user.profile.phoneprefix = codes[item].value;
                if (
                  (!user.profile.phone || user.profile.phone.length < 6) &&
                  ENV !== 'dev'
                ) {
                  Alert.alert(
                    'Phone Number',
                    'Sorry, but the phone number is mandatory and bigger than 5 numbers',
                  );
                  return;
                }
                user.profile = await updateUserData(user);
                setUser(user);
                await identify(user.userid, user.email, user.profile);
                if (settings) {
                  navigation.navigate('Settings');
                } else {
                  navigation.navigate('Profession');
                }
              }}
            />
          </ButtonWrapper>
        </InnerView>
      </MainViewWrapper>
    </Template>
  );
};

PhoneNumberScreen.defaultProps = defaultProps;
PhoneNumberScreen.propTypes = propTypes;
