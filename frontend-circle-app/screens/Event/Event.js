import React, {useContext, useEffect, useState} from 'react';
import {defaultProps, propTypes} from '../components/props';
import {TitleText} from '../components/title-text';
import {
  MainViewWrapper,
  InnerView,
  ImageWrapper,
  ButtonDoubleWrapper,
  GreenButtonFilledView,
  ButtonGreenFilledText,
} from '../components/GlobalStyles';
import {
  TapText,
  SectionText,
  ImageContainer,
  ArrowContainer,
  IconStyled,
  SectionContainer,
  DateContainer,
  SectionIconStyled,
  ConnectText,
  MoreView,
  MoreText,
  BottomText,
  ButtonWrapper,
  GreenButtonView,
  GreyButtonView,
  ButtonText,
  RowView,
  MustText,
  UnderlineText,
  ClockIconStyled,
  TopView,
  ShareButton,
  ShareIconStyled,
} from './styled';
import {ScrollView, Share, Alert} from 'react-native';
import {Template} from '../components/keyboard-safe-view';
import {UserContext} from '../UserContext';
import {trackScreen, track} from '../segment';
import moment from 'moment';
import {
  getEvent,
  userExistsEventJoin,
  setUserEventJoin,
  userExistsEventRemind,
  setUserEventRemind,
  timeUTC,
} from '../../core/events';
import StatusBarColor from '../components/statusBar';
import {ImportantPopUp} from '../components/ImportantPopUp';
import {FadedWrapper} from '../components/faded';
import {useUserIsRegistered} from '../components/useUserIsRegistered';
import {useUserIsVerified} from '../components/useUserIsVerified';
import * as CommonActions from '@react-navigation/routers/src/CommonActions';
import {setMyAnswersEvent} from '../../core';

export const EventScreen = ({navigation, route}) => {
  const {id} = route.params;
  // console.log('event id ', id);
  const {user} = useContext(UserContext);
  const cMinutesDiff = 180;

  if (!user || user === {} || !user.token || !id) {
    navigation.navigate('Start');
  }

  const [event, setEvent] = useState({});
  const [reminded, setReminded] = useState(false);
  const [moreLess, setMoreLess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const profileDone = useUserIsRegistered(user);
  const profileVerified = useUserIsVerified(user.token);

  useEffect(() => {
    trackScreen('Event', user.userid);
  });

  useEffect(() => {
    let isMounted = true;

    const getTheEvent = async () => {
      const res = await getEvent(id);

      if (!isMounted) {
        return;
      }
      // console.log('event', res);

      if (res.eventtime) {
        const timeFormat = 'HH:mm';
        const time = timeUTC(res.eventtime);
        const mTime = moment(time);
        res.date = new Date(time).toDateString();
        res.time = mTime.format(timeFormat);
        res.minutesDiff = mTime.diff(moment(), 'minutes', true).toFixed(0);
        res.image = res.picture
          ? {
              uri: `https://s3.eu-central-1.amazonaws.com/circles.berlin/${res.picture}`,
            }
          : require('../components/images/test.jpg');
      }
      // console.log(res);

      setEvent(res);
    };

    getTheEvent();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    const checkIfUserExistsEventJoin = async () => {
      let res = await userExistsEventJoin(id, user.token);
      // console.log('userExistsEventJoin', res);

      if (!isMounted) {
        return;
      }
      res = await userExistsEventJoin(id, user.token);

      if (res) {
        navigation.navigate('EventBegin', {id});
      }
    };

    checkIfUserExistsEventJoin();

    return () => {
      isMounted = false;
    };
  }, [id, user.token, navigation]);

  const onShare = async () => {
    const text =
      'Hi! I want to invite you to "' +
      event.name +
      '" in Circles! You can install it from: https://getcircles.com';
    try {
      const result = await Share.share({
        message: text,
      });
      if (result.action === Share.sharedAction) {
        await track('User Shares Event', {
          userid: user.userid,
          eventid: event.eventid,
        });
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log('result.activityType', result.activityType);
        } else {
          // shared
          console.log('result.activityType shared', result.activityType);
        }
      } else if (result.action === Share.dismissedAction) {
        await track('User Dismiss Sharing Event', {
          userid: user.userid,
          eventid: event.eventid,
        });
        // dismissed
        console.log('Share.dismissedAction');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const checkIfUserExistsEventRemind = async () => {
      const res = await userExistsEventRemind(id, user.token);
      // console.log('userExistsEventRemind', res);

      if (!isMounted) {
        return;
      }

      setReminded(res);
    };

    checkIfUserExistsEventRemind();

    return () => {
      isMounted = false;
    };
  }, [id, user.token]);

  const setUserJoin = async () => {
    // navigation.navigate('EventMatched', {
    //   title: 'Non beautiful name Chat',
    //   type: 0,
    //   id: '015505fb-7465-4879-83eb-04bd30b2ff6b',
    // });
    // return;

    const time = timeUTC(event.eventtime);
    const mTime = moment(time);
    const minutesDiff = mTime.diff(moment(), 'minutes', true).toFixed(0);
    setEvent({
      ...event,
      minutesDiff,
    });
    // console.log(time);
    // console.log(minutesDiff);
    if (minutesDiff > cMinutesDiff || minutesDiff < 0) {
      setIsVisible(true);
    } else {
      const qAnswers = await setMyAnswersEvent(event.eventquestion, user.token);
      const qAnswersAnswered = qAnswers.filter((a) => a.selectedAnswer);
      // console.log('qAnswersAnswered.length', qAnswersAnswered.length);
      // console.log('event.eventquestion?.length', event.eventquestion?.length);
      if (event.eventquestion?.length !== qAnswersAnswered.length) {
        Alert.alert(
          'Join Event',
          'You must answer all the questions before joining the event, please answer them.',
        );
      } else {
        const res = await setUserEventJoin(id, user.token);
        console.log('setUserEventJoin', res);
        await track('User Joins Event', {
          userid: user.userid,
          eventid: event.eventid,
        });
        navigation.navigate('EventBegin', {id});
      }
    }
  };

  const setUserRemind = async () => {
    const res = await setUserEventRemind(id, user.token);
    console.log('setUserEventRemind', res);
    await track('User Reminds Event', {
      userid: user.userid,
      eventid: event.eventid,
    });
    setReminded(!reminded);
  };

  const hideImportantPopUp = () => {
    setIsVisible(false);
  };

  const answerQuestions = () => {
    navigation.navigate('QuestionsEvent', {
      eventquestion: event.eventquestion,
      id,
    });
  };

  const completeProfile = () => {
    if (!profileVerified) {
      navigation.dispatch(
        CommonActions.reset({
          index: 2,
          routes: [
            {name: 'Events'},
            {name: 'Event', params: {id}},
            {name: 'IncompleteProfile'},
          ],
        }),
      );
    } else {
      navigation.navigate('FirstName');
    }
  };

  return (
    <>
      <StatusBarColor backgroundColor={'white'} />
      <ImportantPopUp
        isVisible={isVisible}
        hideModal={hideImportantPopUp}
        type="0"
      />
      <Template>
        <MainViewWrapper>
          <TopView>
            <ArrowContainer onPress={() => navigation.pop()}>
              <IconStyled name="arrowleft" />
            </ArrowContainer>
            <SectionContainer>
              <DateContainer>
                <SectionIconStyled name="calendar" />
                <SectionText>{event.date}</SectionText>
              </DateContainer>
              <DateContainer>
                <SectionIconStyled name="clockcircleo" />
                <SectionText>{event.time}</SectionText>
              </DateContainer>
              <ShareButton onPress={() => onShare()}>
                <ShareIconStyled name="sharealt" />
              </ShareButton>
            </SectionContainer>
          </TopView>
          <ScrollView showsVerticalScrollIndicator={false}>
            <ImageContainer>
              {event.image && <ImageWrapper source={event.image} />}
            </ImageContainer>
            <InnerView>
              <TitleText
                title={true}
                text={event.name}
                fontSize={'32px'}
                link={event.link}
              />
              {event.description?.length <= 140 ? (
                <ConnectText>{event.description}</ConnectText>
              ) : (
                <>
                  <ConnectText numberOfLines={moreLess ? undefined : 3}>
                    {moreLess ? event.description : event.description + '...'}
                  </ConnectText>
                  <MoreView onPress={() => setMoreLess(!moreLess)}>
                    {event.description?.length > 48 ? (
                      <MoreText>
                        {moreLess ? 'Read less' : 'Read more'}...
                      </MoreText>
                    ) : null}
                  </MoreView>
                </>
              )}
              <TapText>
                <TitleText
                  title={true}
                  text="How can you take part?"
                  fontSize={'18px'}
                />
              </TapText>
              {!profileDone || !profileVerified ? (
                <BottomText>
                  To take part in the event you first need to complete your
                  profile.
                </BottomText>
              ) : event.minutesDiff > cMinutesDiff ? (
                <>
                  <BottomText>
                    To take part in the event, you need to join the event BEFORE
                    it starts.
                  </BottomText>
                  <BottomText>
                    The event will be open to join 3 hours before the start
                    time.
                  </BottomText>
                  {!reminded && (
                    <RowView>
                      <MustText>Tip:</MustText>
                      <UnderlineText>Set a reminder!</UnderlineText>
                    </RowView>
                  )}
                </>
              ) : (
                <>
                  <BottomText>
                    Join the event BEFORE the start time to take part.
                  </BottomText>
                  <BottomText>Join now!</BottomText>
                </>
              )}
            </InnerView>
          </ScrollView>
          <FadedWrapper />
          <ButtonWrapper>
            {event.minutesDiff <= cMinutesDiff && event.minutesDiff > -1 ? (
              <GreenButtonView>
                <ClockIconStyled name="clockcircleo" />
                <ButtonText>
                  ONLY {event.minutesDiff} minutes LEFT, JOIN NOW!
                </ButtonText>
              </GreenButtonView>
            ) : null}
            {!profileDone || !profileVerified ? (
              <ButtonDoubleWrapper>
                <GreenButtonFilledView onPress={() => completeProfile()}>
                  <ButtonGreenFilledText>
                    Complete Your Profile First
                  </ButtonGreenFilledText>
                </GreenButtonFilledView>
              </ButtonDoubleWrapper>
            ) : event.minutesDiff <= cMinutesDiff && event.minutesDiff > -1 ? (
              <ButtonDoubleWrapper>
                {event.eventquestion?.length > 0 && (
                  <GreenButtonFilledView onPress={() => answerQuestions()}>
                    <ButtonGreenFilledText>
                      Answer Questions
                    </ButtonGreenFilledText>
                  </GreenButtonFilledView>
                )}
                <GreenButtonFilledView onPress={() => setUserJoin()}>
                  <ButtonGreenFilledText>Join Event</ButtonGreenFilledText>
                </GreenButtonFilledView>
              </ButtonDoubleWrapper>
            ) : (
              <ButtonDoubleWrapper>
                {reminded ? (
                  <GreyButtonView onPress={() => setUserRemind()}>
                    <ButtonGreenFilledText>
                      Cancel reminder
                    </ButtonGreenFilledText>
                  </GreyButtonView>
                ) : (
                  <GreenButtonFilledView onPress={() => setUserRemind()}>
                    <ButtonGreenFilledText>
                      Set a reminder
                    </ButtonGreenFilledText>
                  </GreenButtonFilledView>
                )}
                {event.eventquestion?.length > 0 ? (
                  <GreenButtonFilledView onPress={() => answerQuestions()}>
                    <ButtonGreenFilledText>
                      Answer Questions
                    </ButtonGreenFilledText>
                  </GreenButtonFilledView>
                ) : (
                  <GreyButtonView onPress={() => setUserJoin()}>
                    <ButtonGreenFilledText>Join Event</ButtonGreenFilledText>
                  </GreyButtonView>
                )}
              </ButtonDoubleWrapper>
            )}
          </ButtonWrapper>
        </MainViewWrapper>
      </Template>
    </>
  );
};

EventScreen.defaultProps = defaultProps;
EventScreen.propTypes = propTypes;
