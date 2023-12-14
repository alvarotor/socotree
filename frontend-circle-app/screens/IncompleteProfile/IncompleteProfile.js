import React, {useEffect, useState, useContext} from 'react';
import {defaultProps, propTypes} from '../components/propsNavigation';
import {
  ImageWrapper,
  ImageOut,
  MailContainer,
  BottomTextWrapper,
  BottomButtonWrapper,
  VerifyText,
  InfoWrapper,
  InfoText,
  EmotionWrapper,
} from './styled';
import {
  MainViewWrapper,
  InnerView,
  // Separator,
} from '../components/GlobalStyles';
import {AppHeader} from '../components/app-header';
import {TitleText} from '../components/title-text';
import {Button} from '../components/button';
import {ProfileImageBubble} from '../components/ProfileImageBubble';
import {UserContext} from '../UserContext';
import {readIfUserVerified} from '../../core';
import {ScrollView, Alert} from 'react-native';
import * as CommonActions from '@react-navigation/routers/src/CommonActions';
// import {HowCirclesWorksScreen} from '../YouAreListed/HowCirclesWorks';
import {trackScreen} from '../segment';

export const IncompleteProfileScreen = ({navigation}) => {
  const {user} = useContext(UserContext);

  if (!user || user === {} || !user.token || !user.profile) {
    navigation.navigate('Start');
  }

  const [name, setName] = useState(false);
  const [photo, setPhoto] = useState(false);
  const [dob, setDOB] = useState(false);
  const [interests, setInterests] = useState(false);
  const [questions, setQuestions] = useState(false);
  const [district, setDistrict] = useState(false);

  useEffect(() => {
    trackScreen('IncompleteProfile', user.userid);
  });

  useEffect(() => {
    setName(user.profile.adminrejectedname);
    setPhoto(user.profile.adminrejectedphoto);
    setDOB(user.profile.adminrejecteddob);
    setInterests(user.profile.adminrejectedinterests);
    setQuestions(user.profile.adminrejectedquestions);
    setDistrict(user.profile.adminrejecteddistrict);
  }, [navigation, user]);

  const fixProfileIssues = () => {
    navigation.navigate('EditProfile');
  };

  const onVerify = async () => {
    const v = await readIfUserVerified(user.token);
    if (
      !v.profile?.adminrejectedname &&
      !v.profile?.adminrejecteddob &&
      !v.profile?.adminrejectedphoto &&
      !v.profile?.adminrejectedinterests &&
      !v.profile?.adminrejectedquestions &&
      !v.profile?.adminrejecteddistrict
    ) {
      Alert.alert('Verified', 'Congrats! Your profile has been verified! :)', [
        {
          text: 'OK',
          onPress: async () => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Events'}],
              }),
            );
          },
        },
      ]);
    } else {
      Alert.alert(
        'Verified',
        'Sorry! Your profile has not been verified yet! please double check your info is correct if you have not yet! :)',
      );
    }
  };

  return (
    <MainViewWrapper>
      <AppHeader
        navigation={navigation}
        rightButton={{
          imageUrl: user.profile.photo ? user.profile.photo : 'test',
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <MailContainer>
          <ProfileImageBubble />
          <ImageOut>
            <ImageWrapper
              source={require('../components/images/incomplete_profile.png')}
            />
          </ImageOut>
          <InnerView>
            <BottomTextWrapper>
              <TitleText
                title={true}
                text="Update your profile"
                fontSize={'44px'}
              />
              <VerifyText>
                Please update your user profile to use the CIRCLES App. After
                you’ve updated your profile it can take up to 48 hours until
                your profile is verified.
              </VerifyText>
            </BottomTextWrapper>
            <TitleText
              title={true}
              fontSize={'10px'}
              text="THE INFORMATION THAT IS MISSING"
            />
            {name && (
              <InfoWrapper>
                <EmotionWrapper
                  source={require('../components/images/sad.png')}
                />
                <InfoText>
                  Your name does not correspond with a real name.
                </InfoText>
              </InfoWrapper>
            )}
            {photo && (
              <InfoWrapper>
                <EmotionWrapper
                  source={require('../components/images/sad.png')}
                />
                <InfoText>
                  Your photo is not showing a clear view of your face.
                </InfoText>
              </InfoWrapper>
            )}
            {dob && (
              <InfoWrapper>
                <EmotionWrapper
                  source={require('../components/images/sad.png')}
                />
                <InfoText>Your date of birth seems to be incorrect.</InfoText>
              </InfoWrapper>
            )}
            {interests && (
              <InfoWrapper>
                <EmotionWrapper
                  source={require('../components/images/sad.png')}
                />
                <InfoText>Your interests seems to be incorrect.</InfoText>
              </InfoWrapper>
            )}
            {questions && (
              <InfoWrapper>
                <EmotionWrapper
                  source={require('../components/images/sad.png')}
                />
                <InfoText>Your questions seems to be incorrect.</InfoText>
              </InfoWrapper>
            )}
            {district && (
              <InfoWrapper>
                <EmotionWrapper
                  source={require('../components/images/sad.png')}
                />
                <InfoText>Your district seems to be incorrect.</InfoText>
              </InfoWrapper>
            )}
            <TitleText
              title={true}
              fontSize={'10px'}
              text="WHAT TO DO TO CORRECT"
            />
            {name && (
              <InfoWrapper>
                <EmotionWrapper
                  source={require('../components/images/happy.png')}
                />
                <InfoText>
                  Change your name for your real one, or a way that people can
                  call you.
                </InfoText>
              </InfoWrapper>
            )}
            {photo && (
              <InfoWrapper>
                <EmotionWrapper
                  source={require('../components/images/happy.png')}
                />
                <InfoText>
                  Please upload a photo that shows a clear depiction of your
                  face.
                </InfoText>
              </InfoWrapper>
            )}
            {dob && (
              <InfoWrapper>
                <EmotionWrapper
                  source={require('../components/images/happy.png')}
                />
                <InfoText>
                  Change your age to you real age, so that we can match you with
                  people with similar age.
                </InfoText>
              </InfoWrapper>
            )}
            {interests && (
              <InfoWrapper>
                <EmotionWrapper
                  source={require('../components/images/happy.png')}
                />
                <InfoText>
                  Change your interests we can match you with people with
                  similar interests as yours.
                </InfoText>
              </InfoWrapper>
            )}
            {questions && (
              <InfoWrapper>
                <EmotionWrapper
                  source={require('../components/images/happy.png')}
                />
                <InfoText>
                  Change your questions we can match you with people with
                  similar questions as yours.
                </InfoText>
              </InfoWrapper>
            )}
            {district && (
              <InfoWrapper>
                <EmotionWrapper
                  source={require('../components/images/happy.png')}
                />
                <InfoText>
                  Change your district we can match you with people with similar
                  district as yours.
                </InfoText>
              </InfoWrapper>
            )}
            <BottomButtonWrapper>
              <Button buttonText="Fix the issue" onPress={fixProfileIssues} />
            </BottomButtonWrapper>
            <BottomButtonWrapper>
              <Button
                buttonText="Check if you are verified"
                onPress={() => onVerify()}
              />
            </BottomButtonWrapper>
            {/* <Separator />  */}
            {/* <HowCirclesWorksScreen navigation={navigation} /> */}
          </InnerView>
        </MailContainer>
      </ScrollView>
    </MainViewWrapper>
  );
};

IncompleteProfileScreen.defaultProps = defaultProps;
IncompleteProfileScreen.propTypes = propTypes;
