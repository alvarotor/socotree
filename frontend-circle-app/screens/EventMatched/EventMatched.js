import React, {useEffect, useState, useContext, useRef} from 'react';
import {defaultProps, propTypes} from '../components/props';
import {EventHeader} from '../components/event-header';
import {TitleText} from '../components/title-text';
import {Button} from '../components/button';
import {
  InputFieldWrapper,
  MainViewWrapper,
  ButtonWrapper,
  InnerView,
  ImageWrapper,
  ActivityIndicator,
  InterestWrapper,
  InterestSmall,
} from '../components/GlobalStyles';
import {
  InnerWrapper,
  TapText,
  ImageContainer,
  ConnectText,
  SubTitleText,
} from './styled';
import {ScrollView} from 'react-native';
import {Template} from '../components/keyboard-safe-view';
import {UserContext} from '../UserContext';
import {checkCircle, checkMyCircles} from '../../core';
import * as CommonActions from '@react-navigation/routers/src/CommonActions';
import {trackScreen, track} from '../segment';

export const EventMatchedScreen = ({navigation, route}) => {
  const {title, id, type} = route.params;
  // const title = 'route.params';
  // const id = '7d75edb4-d5d5-4900-9811-b2043382cb42';
  // const type = 1;
  // console.log('title, id, type', title, id, type);
  const {user} = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  let circle = useRef([]);

  useEffect(() => {
    trackScreen('Event Matched', user.userid);
  });

  useEffect(() => {
    let isMounted = true;

    const get = async () => {
      let usersFormatted;
      const circles = await checkMyCircles(user.token);
      // console.log('circles', circles);
      let circleFiltered = circles.filter((c) => c.eventid === id);
      // console.log('circleFiltered', circleFiltered);
      if (circleFiltered.length === 0) {
        setLoading(false);
        setUsers([]);
        return;
      }
      circleFiltered = circleFiltered[0].circleid;
      circle.current = await checkCircle(user.token, circleFiltered);
      if (!isMounted) {
        return;
      }
      // console.log('circle.current', circle.current);

      usersFormatted = circle.current.map((c) => {
        // console.log('c.user.userinterest', c.user.userinterest);
        return {
          interests: c.user.userinterest,
          name: c.user.profile.name,
          image: c.user.profile.photo
            ? {
                uri: c.user.profile.photo,
              }
            : require('../components/images/test.jpg'),
        };
      });
      // console.log('usersFormatted', usersFormatted);

      setUsers(usersFormatted);
      setLoading(false);

      // console.log('done');
    };

    get();

    return () => {
      isMounted = false;
    };
  }, [user.token, id]);

  const onPressContinue = async () => {
    if (users.length === 0) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Events'}],
        }),
      );
    } else {
      await track('User Joins Videocall / Chat', {
        userid: user.userid,
        eventid: id,
      });
      if (type === 0) {
        navigation.dispatch(
          CommonActions.reset({
            index: 2,
            routes: [
              {name: 'Events'},
              {name: 'Circles'},
              {name: 'Chat', params: {users: circle.current}},
            ],
          }),
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 3,
            routes: [
              {name: 'Events'},
              {name: 'Circles'},
              {name: 'Chat', params: {users: circle.current}},
              {
                name: 'GroupVideoChat',
                params: {
                  circleid: circle.current[0].circleid,
                  users: circle.current,
                },
              },
            ],
          }),
        );
      }
    }
  };

  return (
    <Template>
      <MainViewWrapper>
        <EventHeader
          title={title}
          backgroundColor={'#05ea00'}
          navigation={navigation}
        />
        <InnerView>
          <ScrollView showsVerticalScrollIndicator={false}>
            <InputFieldWrapper>
              {loading ? (
                <ActivityIndicator
                  animating={loading}
                  size="large"
                  color={'#05EA00'}
                />
              ) : users.length > 0 ? (
                <>
                  <SubTitleText>TALK WITH YOUR MATCH NOW!</SubTitleText>
                  <TapText>
                    <TitleText
                      title={true}
                      text={
                        type === 0
                          ? 'Join the circle chat now!'
                          : 'Join the video call now!'
                      }
                      fontSize={'40px'}
                    />
                  </TapText>
                </>
              ) : (
                <>
                  <TitleText
                    title={true}
                    text="SORRY, NOT MATCHED"
                    fontSize={'40px'}
                  />
                  <ConnectText>
                    We could not find a right match for you
                  </ConnectText>
                </>
              )}
              {!loading ? (
                users.length > 0 ? (
                  <>
                    {users.map((item, i) => {
                      // console.log('i', i);
                      return (
                        <>
                          <InnerWrapper key={'name' + i}>
                            <ImageContainer>
                              <ImageWrapper source={item.image} />
                            </ImageContainer>
                            <TitleText
                              title={true}
                              text={item.name}
                              fontSize={'16px'}
                            />
                          </InnerWrapper>
                          <InterestWrapper key={'interest' + i}>
                            {item.interests?.map((interest) => {
                              // console.log('interest', interest);
                              if (interest.interest.name) {
                                return (
                                  <InterestSmall key={interest.interestid}>
                                    <TitleText
                                      text={interest.interest.name}
                                      color="#fff"
                                      fontSize="12px"
                                    />
                                  </InterestSmall>
                                );
                              }
                            })}
                          </InterestWrapper>
                        </>
                      );
                    })}
                    {/* <ConnectText>
                      Your match is looking forward to connect with you!
                    </ConnectText> */}
                  </>
                ) : null
              ) : null}
            </InputFieldWrapper>
          </ScrollView>
          <ButtonWrapper>
            <Button
              buttonText={
                users.length > 0
                  ? type === 0
                    ? 'Go to chat'
                    : 'Join video call'
                  : 'Going back to Events'
              }
              onPress={() => onPressContinue()}
            />
          </ButtonWrapper>
        </InnerView>
      </MainViewWrapper>
    </Template>
  );
};

EventMatchedScreen.defaultProps = defaultProps;
EventMatchedScreen.propTypes = propTypes;
