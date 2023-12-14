import React, {useState, useEffect, useContext} from 'react';
import {defaultProps, propTypes} from '../components/propsNavigation';
import {ScreenHeaderShape} from '../components/screen-header-shape';
import {TitleText} from '../components/title-text';
import {
  SafeAreaViewWrapper,
  Body,
  ListSection,
  InterestWrapper,
  Interest,
  Separator,
  FadedSeparator,
} from '../components/GlobalStyles';
import {
  ProfileImageWrapper,
  ProfileImage,
  EditImageWrapper,
  CameraImage,
  ContentWrapper,
  SafeAreaViewWrapperBottom,
} from './styled';
import {questions as qRead, setMyAnswers} from '../../core';
import {View} from 'react-native';
import districts from '../components/districts/districts';
import {UserContext} from '../UserContext';
import {AppHeader} from '../components/app-header';
import {trackScreen} from '../segment';
import {BottomTab} from '../components/botom-tab';
import {FadedWrapper} from '../components/faded';
import {GreenButtonView, ButtonWrapper, ButtonText} from './styled';

export const ProfileScreen = ({navigation, route}) => {
  const {user} = useContext(UserContext);

  if (!user || user === {} || !user.token || !user.profile) {
    navigation.navigate('Start');
  }

  const [questions, setQuestions] = useState([]);
  const [district, setDistrict] = useState('');

  useEffect(() => {
    trackScreen('Profile', user.userid);

    const getQuestions = async () => {
      const qSaved = await qRead();
      const qAnswers = await setMyAnswers(qSaved, user.token);
      setQuestions(qAnswers);
    };

    getQuestions();

    setDistrict(districts[user.profile.district].label);
  }, [user.answers, user.profile.district, user.token, user.userid]);

  return (
    <SafeAreaViewWrapper>
      <AppHeader
        navigation={navigation}
        route={route}
        leftButton={{isHidden: true}}
        backgroundColor={'#f2fff2'}
        rightButton={{
          iconName: 'setting',
          onPress: () => navigation.navigate('Settings'),
        }}
      />
      <ScreenHeaderShape titleText={'Profile'} />
      <ProfileImageWrapper>
        <ProfileImage
          source={{
            uri:
              user.profile.photo && user.profile.photo.length > 0
                ? user.profile.photo
                : 'https://i.vimeocdn.com/portrait/58832_300x300.jpg',
          }}
        />
        <EditImageWrapper
          onPress={() =>
            navigation.navigate('UploadPhoto', {
              profile: true,
            })
          }>
          <CameraImage
            source={require('../components/images/camera_img.png')}
          />
        </EditImageWrapper>
      </ProfileImageWrapper>
      <SafeAreaViewWrapperBottom>
        <ContentWrapper>
          <Body>
            <ListSection>
              <TitleText text={user.profile.name} title={true} />
              {user.profile.district > 0 ? (
                <TitleText
                  text={district + ', Berlin, Germany.'}
                  color={'rgba(1, 1, 1, 0.45);'}
                />
              ) : null}
            </ListSection>
            <ListSection>
              <TitleText
                text={`${user.profile.name}'s interests`.toUpperCase()}
                fontSize={'14px'}
                title={true}
              />
            </ListSection>
            <Separator />
            <InterestWrapper>
              {user.userinterest
                ? user.userinterest.map((interest) => {
                    if (interest.interest.name) {
                      return (
                        <Interest key={interest.interestid}>
                          <TitleText
                            text={interest.interest.name}
                            color="#fff"
                          />
                        </Interest>
                      );
                    }
                  })
                : null}
            </InterestWrapper>
            {questions ? (
              <View>
                <ListSection>
                  <TitleText
                    text={`${user.profile.name}'s answers`.toUpperCase()}
                    fontSize={'14px'}
                    title={true}
                  />
                </ListSection>
                {questions.map((answer) => {
                  const answered = answer.answers.filter(
                    (ans) => ans.uuid === answer.selectedAnswer,
                  )[0];
                  if (answered) {
                    return (
                      <View key={answer.uuid}>
                        <ListSection>
                          <TitleText
                            text={answer.question}
                            title={true}
                            fontSize={'14px'}
                          />
                        </ListSection>
                        <ListSection>
                          <TitleText text={answered.answer} fontSize={'14px'} />
                        </ListSection>
                      </View>
                    );
                  } else {
                    return null;
                  }
                })}
              </View>
            ) : null}
            <FadedSeparator />
          </Body>
        </ContentWrapper>
      </SafeAreaViewWrapperBottom>
      <FadedWrapper />
      <ButtonWrapper>
        <GreenButtonView onPress={() => navigation.navigate('EditProfile')}>
          <ButtonText>Edit Profile</ButtonText>
        </GreenButtonView>
      </ButtonWrapper>
      <BottomTab isProfile={true} navigation={navigation} />
    </SafeAreaViewWrapper>
  );
};

ProfileScreen.defaultProps = defaultProps;
ProfileScreen.propTypes = propTypes;
