import React, {useContext, useState, useEffect} from 'react';
import {Alert, ScrollView} from 'react-native';
import ENV from '../../active.env';
import {updateUserData} from '../../core';
import {AppHeader} from '../components/app-header';
import {Button} from '../components/button';
import districts from '../components/districts/districts';
import {PickerBox} from '../components/PickerBox';
import {defaultProps, propTypes} from '../components/props';
import {TitleText} from '../components/title-text';
import {
  ButtonWrapper,
  InnerView,
  InputFieldWrapper,
  MainViewWrapper,
  GrayBar,
  GreenBar,
} from '../components/GlobalStyles';
import {UserContext} from '../UserContext';
import {identify, trackScreen} from '../segment';

export const DistrictScreen = ({navigation, route}) => {
  const {settings} = route.params;
  const {user, setUser} = useContext(UserContext);

  if (!user || user === {} || !user.token || !user.profile) {
    navigation.navigate('Start');
  }

  const [value, setValue] = useState(user.profile.district);

  useEffect(() => {
    trackScreen('District', user.userid);
  });

  const onSelectDistrict = (item) => {
    setValue(item);
  };

  return (
    <MainViewWrapper>
      {!settings ? (
        <GrayBar>
          <GreenBar width={(100 / 6) * 3} />
        </GrayBar>
      ) : null}
      <AppHeader navigation={navigation} />
      <InnerView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <InputFieldWrapper>
            <TitleText
              title={true}
              text="What is your district in Berlin?"
              fontSize={'40px'}
            />
            <PickerBox
              options={districts}
              value={districts[value].label}
              onChange={(values) => onSelectDistrict(values)}
            />
          </InputFieldWrapper>
        </ScrollView>
        <ButtonWrapper>
          <Button
            buttonText="Continue"
            onPress={async () => {
              user.profile.district = value;
              if (user.profile.district < 1 && ENV !== 'dev') {
                Alert.alert(
                  'District',
                  'Sorry, but you must choose your district',
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
                navigation.navigate('Interests', {settings: false});
              }
            }}
          />
        </ButtonWrapper>
      </InnerView>
    </MainViewWrapper>
  );
};

DistrictScreen.defaultProps = defaultProps;
DistrictScreen.propTypes = propTypes;
