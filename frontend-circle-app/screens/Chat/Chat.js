import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  useContext,
} from 'react';
import {
  Alert,
  Modal,
  View,
  ScrollView,
  TouchableHighlight,
  Keyboard,
  BackHandler,
  StyleSheet,
  Dimensions,
} from 'react-native';
// import {useFocusEffect} from '@react-navigation/native';
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import ENV from '../../env';
import {
  createCircleChat,
  formatMessage,
  welcomeMessages,
  circleGetMessages,
  sendMessage,
} from './messages';
import {
  MainViewWrapper,
  InnerView,
  CrossIconStyled,
  CrossIconContainerStyled,
  SafeAreaViewWrapper,
  InterestWrapper,
  Interest,
} from '../components/GlobalStyles';
import {
  MainWrapper,
  HeaderView,
  ImageWrapperProfile,
  BorderView,
  ChatView,
  IconArrowMain,
  IconStyled,
  IconContainer,
  BirthDateWrapper,
  ButtonWrapper,
  VideoBtnWrapper,
  UserDetailWrapper,
  CameraIconStyled,
  ShareLocationWrapper,
  ActivityIndicator,
} from './styled';
import {defaultProps, propTypes} from '../components/props';
import {
  ImageContainer,
  ImageWrapper,
  TextMainWrapper,
  CountWrapper,
  ReportWrapper,
  ReportText,
} from '../FoundYourCircle/styled';
import {TitleText} from '../components/title-text';
import {mailReportUser} from '../../core/user';
import {UserContext} from '../UserContext';
import {blockProfile, isUserBlocked} from '../../core';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-community/async-storage';
import * as CommonActions from '@react-navigation/routers/src/CommonActions';
import {trackScreen, trackGroup, track} from '../segment';
import moment from 'moment';
import MapView, {Marker} from 'react-native-maps';
import {requestLocation} from '../../core/geo';

export const ChatScreen = ({navigation, route}) => {
  const {users, event} = route.params;
  const {user, setUser} = useContext(UserContext);

  if (!user || user === {} || !user.token || !user.profile || !users) {
    navigation.navigate('Start');
  }

  const connRef = useRef();

  const [allMessages, setAllMessages] = useState(welcomeMessages(null));
  const [chatters, setChatters] = useState([]);
  const [modalUsers, setModalUsers] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const {width, height} = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.001;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  useEffect(() => {
    trackScreen('Chat', user.userid);
    track('Circle Joined', {
      userid: user.userid,
      circleid: users[0].circleid,
      eventid: users[0].eventid,
    });
    trackGroup(
      users[0].eventid + '@' + users[0].circleid,
      Object.assign(
        {},
        Object.keys(users).map((v) => users[v].userid),
      ),
    );
  });

  useEffect(() => {
    const getMessagesServer = async () => {
      const messages = await circleGetMessages(
        users[0].circleid,
        user.token,
      ).catch((err) => {
        console.log(err);
        Alert.alert(
          'Messages Error',
          'There has been some problem getting your messages. Please, try again later.',
        );
      });

      let listMessages = [];
      messages.map((m) => {
        if (!isUserBlocked(user, m.userid)) {
          let uMes = getUserData(m.userid);
          listMessages.push(
            formatMessage(
              m.message.startsWith('GPS@') ? '' : m.message,
              {
                _id: m.userid,
                name: uMes.name,
                avatar: uMes.photo,
              },
              m.created,
              m.message.startsWith('GPS@') ? m.message : null,
            ),
          );
        }
      });
      setAllMessages((oldMessages) => [
        ...listMessages.reverse(),
        ...oldMessages,
      ]);
    };

    getMessagesServer();
  }, [getUserData, user, users]);

  const userMe = {
    _id: user.userid,
    name: user.profile.name,
    avatar: user.profile.photo,
  };

  const onSendMessage = useCallback(
    (messagesTransmit) => {
      // console.log('messagesTransmit', messagesTransmit);
      messagesTransmit.map(async (m) => {
        m.text = m.text.replace(/\n/g, ' '); // remove newlines
        const mResponse = await sendMessage(
          users[0].circleid,
          m.text,
          user.token,
        );
        if (!mResponse) {
          Toast.show({
            text1: 'Problem sending the last message.',
            text2:
              'We could not send last message properly, ' +
              'maybe the other users did not get your message.' +
              'Please, try again.',
          });
          await track('Send Message Error', {
            userid: user.userid,
            message: m.text,
            circleid: users[0].circleid,
            eventid: users[0].eventid,
          });
          return;
        }
        connRef.current.send(
          JSON.stringify({
            sender: userMe._id,
            message: m.text,
          }),
        );
        await track('Send Message', {
          userid: user.userid,
          message: m.text,
          circleid: users[0].circleid,
          eventid: users[0].eventid,
        });
      });
    },
    [user.token, user.userid, userMe._id, users],
  );

  const renderCustomView = (props) => {
    const {currentMessage} = props;
    // console.log('renderCustomView', currentMessage);
    if (currentMessage.text.startsWith('GPS@')) {
      const coord = currentMessage.text.substring(4).split(',');
      currentMessage.location = {};
      currentMessage.location.latitude = coord[0];
      currentMessage.location.longitude = coord[1];
    }
    if (currentMessage.location) {
      // console.log('currentMessage.location', currentMessage.location);
      currentMessage.text = '';
      return (
        <View
          style={[styles.mapContainer]}
          key={Math.round(Math.random() * 1000000)}>
          <MapView
            key={Math.round(Math.random() * 1000000)}
            style={[styles.mapView]}
            initialRegion={{
              latitude: parseFloat(currentMessage.location.latitude),
              longitude: parseFloat(currentMessage.location.longitude),
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}>
            <Marker
              coordinate={{
                latitude: parseFloat(currentMessage.location.latitude),
                longitude: parseFloat(currentMessage.location.longitude),
              }}
            />
          </MapView>
        </View>
      );
    }
    return null;
  };

  const renderBubble = (props) => {
    // console.log(props.currentMessage);
    if (props.system) {
      return <Bubble {...props} />;
    }
    if (props.currentMessage.user.name === '£$Socotree@#') {
      return (
        <Bubble
          {...props}
          textStyle={{
            left: {
              color: 'black',
            },
          }}
          wrapperStyle={{
            left: {
              backgroundColor: 'yellow',
            },
          }}
        />
      );
    }
    if (props.currentMessage.user.name === '£$SocotreeLink@#') {
      return (
        <Bubble
          {...props}
          textStyle={{
            left: {
              color: 'blue',
            },
          }}
          wrapperStyle={{
            left: {
              backgroundColor: 'white',
              borderWidth: 2,
              borderColor: 'blue',
            },
          }}
        />
      );
    }
    return <Bubble {...props} />;
  };

  const getUserData = useCallback(
    (userID) => {
      let uMes;
      for (let i = 0; i < users.length; i++) {
        const u = users[i];
        if (u.userid === userID) {
          uMes = {
            photo: u.user.profile.photo,
            name: u.user.profile.name,
          };
          break;
        }
      }
      return uMes;
    },
    [users],
  );

  const notification = (message, system) => {
    setAllMessages((oldMessages) => [
      formatMessage(
        message,
        {
          _id: 'Socotree',
          name: '£$Socotree@#',
          avatar: require('../components/images/logo_no_name.png'),
        },
        undefined,
        undefined,
        system,
      ),
      ...oldMessages,
    ]);
  };

  const connectChat = useCallback(async () => {
    const circleid = users[0].circleid;
    const eventid = users[0].eventid;
    const userid = user.userid;
    const itemCircleName = 'circle-' + circleid;
    await AsyncStorage.setItem(itemCircleName, new Date().toISOString());
    const circleCreated = await createCircleChat(eventid, circleid);
    if (!circleCreated) {
      return;
    }
    connRef.current = new WebSocket(
      `${ENV.APIWS}messages/v2/circle_event/${eventid}@${circleid}?userid=${userid}`,
    );
    connRef.current.onopen = () => {
      console.log('socket onopen ' + circleid);
      // sendMessage([formatMessage('Im connected', userMe)]);
    };
    connRef.current.onclose = (ev) => {
      track('Chat OnClose', {
        userid: user.userid,
        circleid: users[0].circleid,
        eventid: users[0].eventid,
      });
      if (ev.wasClean) {
        console.log(
          `[close] Connection closed cleanly, code=${ev.code} reason=${ev.reason}`,
        );
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log(
          `[close] Connection died, code=${ev.code} reason=${ev.reason}`,
        );
      }
      console.log('socket onclose ' + circleid);
      if (!connRef.current.leavingChatScreen) {
        // navigation.goBack();
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Circles',
              },
            ],
          }),
        );
      }
    };
    connRef.current.onmessage = (evt) => {
      const server = JSON.parse(evt.data);
      if (server.message) {
        if (isUserBlocked(user, server.sender)) {
          return;
        }
        let uMes = getUserData(server.sender);
        if (server.message.startsWith('£$Socotree@#')) {
          switch (server.message) {
            case '£$Socotree@#JOIN':
              notification(uMes.name + ' just joined...', true);
              break;

            case '£$Socotree@#LEAVE':
              notification(uMes.name + ' just left...', true);
              break;

            case '£$Socotree@#VIDEO':
              notification(uMes.name + ' entered the video circle...');
              break;

            default:
              break;
          }
          return;
        }
        setAllMessages((oldMessages) => [
          formatMessage(server.message, {
            _id: server.sender,
            name: uMes.name,
            avatar: uMes.photo,
          }),
          ...oldMessages,
        ]);
      }
    };
    connRef.current.onerror = (evt) => {
      console.log('ERROR WS: ' + JSON.stringify(evt));
    };
  }, [getUserData, navigation, user, users]);

  useEffect(() => {
    let isCancelled = false;

    const chatter = (i, photo) => {
      return (
        <TouchableHighlight
          underlayColor="#ffffff00"
          key={i}
          onPress={() => setModalUsers((modal) => !modal)}>
          <ImageWrapperProfile
            source={{
              uri: !photo
                ? 'https://i.vimeocdn.com/portrait/58832_300x300.jpg'
                : photo,
            }}
          />
        </TouchableHighlight>
      );
    };

    const getChatters = () => {
      let chattersArray = [];
      for (let i = 0; i < users.length; i++) {
        if (user.blockedusers && !isUserBlocked(user, users[i].userid)) {
          chattersArray.push(chatter(i, users[i].user.profile.photo));
        }
      }
      setChatters(chattersArray);
    };

    if (!isCancelled) {
      getChatters();
      connectChat();
    }

    return () => {
      isCancelled = true;
    };
  }, [connectChat, users, user]);

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log('hardwareBackPress subscribed');
  //     BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
  //   }, [backButtonHandler]),
  // );

  const backButtonHandler = useCallback(() => {
    track('Chat backButtonHandler', {
      userid: user.userid,
      circleid: users[0].circleid,
      eventid: users[0].eventid,
    });
    BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
    console.log('Leaving screen chat in hardware back button');
    connRef.current.leavingChatScreen = true;
    connRef.current.close();
    navigation.goBack();
  }, [navigation, user.userid, users]);

  const reportUser = (nameProfile, profileReported) => {
    Alert.alert(
      'Report User',
      'Are you sure that you want to report ' + nameProfile + '?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () =>
            await mailReportUser(profileReported, user.token)
              .then((res) => {
                track('Report User', {reporter: user.userid, profileReported});
                Alert.alert('Report User', `${nameProfile} has been reported.`);
              })
              .catch((err) =>
                Alert.alert(
                  'Report User Error',
                  `There has been some problem reporting ${nameProfile}. Please, try again later.` +
                    err.message || JSON.stringify(err),
                ),
              ),
        },
      ],
      {cancelable: false},
    );
  };

  const blockUser = (nameProfile, profileBlocked) => {
    Alert.alert(
      'Block User',
      'Are you sure that you want to block ' + nameProfile + '?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            console.log('Leaving screen chat after blocking user');
            connRef.current.close();
            setTimeout(
              await blockProfile(profileBlocked, user.token)
                .then((res) => {
                  if (res) {
                    track('Block User', {userid: user.userid, profileBlocked});
                    Toast.show({
                      text1: `${nameProfile} has been blocked.`,
                      text2: 'You will not see more messages from that user.',
                    });
                    setTimeout(() => {
                      const updatedUser = {
                        ...user,
                        blockedusers: [
                          ...user.blockedusers,
                          {userblockedid: profileBlocked},
                        ],
                      };
                      AsyncStorage.setItem(
                        'loginUser',
                        JSON.stringify(updatedUser),
                      );
                      setUser(updatedUser);
                    }, 1500);
                  } else {
                    Alert.alert(
                      'Block User Error',
                      `There has been some problem blocking ${nameProfile}. Please, try again later.`,
                    );
                  }
                })
                .catch((err) =>
                  Alert.alert(
                    'Block User Error',
                    `There has been some problem blocking ${nameProfile}. Please, try again later. ` +
                      err.message || JSON.stringify(err),
                  ),
                ),
              2000,
            );
          },
        },
      ],
      {cancelable: false},
    );
  };

  const shareLocation = async () => {
    try {
      setIsLoadingLocation(true);
      const locationDetails = await requestLocation(false);
      // console.log('locationDetails', locationDetails);
      const locationDetailsStr = `GPS@${locationDetails[0].latitude},${locationDetails[0].longitude}`;
      // console.log('locationDetailsStr', locationDetailsStr);
      onSendMessage([
        formatMessage(
          locationDetailsStr,
          userMe,
          new Date(),
          locationDetailsStr,
        ),
      ]);
      setModalUsers(false);
      setIsLoadingLocation(false);
    } catch (error) {
      Alert.alert('Circles chat error', error);
      setIsLoadingLocation(false);
    }
  };

  const styles = StyleSheet.create({
    mapView: {
      width: 280,
      height: 290,
      borderRadius: 5,
      margin: 10,
    },
    mapContainer: {
      width: 300,
      height: 300,
    },
  });

  return (
    <MainWrapper>
      <HeaderView>
        <IconArrowMain
          onPress={() => {
            console.log('Leaving screen chat back button');
            track('Leaving screen chat back button', {userid: user.userid});
            BackHandler.removeEventListener(
              'hardwareBackPress',
              backButtonHandler,
            );
            connRef.current.close(1000, 'back button');

            if (connRef.current.readyState === 3) {
              navigation.goBack();
            }
            // navigation will happen in websocket closed method
          }}>
          <IconStyled name="arrowleft" />
        </IconArrowMain>
        {chatters}
        <VideoBtnWrapper
          hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
          underlayColor="#ffffff00"
          onPress={() => {
            track('Chat GroupVideoChat button pressed', {
              userid: user.userid,
              circleid: users[0].circleid,
              eventid: users[0].eventid,
            });
            BackHandler.removeEventListener(
              'hardwareBackPress',
              backButtonHandler,
            );
            Keyboard.dismiss();
            connRef.current.send(
              JSON.stringify({
                sender: userMe._id,
                message: '£$Socotree@#VIDEO',
              }),
            );
            navigation.navigate('GroupVideoChat', {
              circleid: users[0].circleid,
              users,
            });
          }}>
          <CameraIconStyled name="video-camera" />
        </VideoBtnWrapper>
      </HeaderView>
      <Modal animationType="slide" transparent={false} visible={modalUsers}>
        <MainViewWrapper>
          <InnerView>
            <SafeAreaViewWrapper>
              <ScrollView showsVerticalScrollIndicator={false}>
                <IconContainer>
                  <CrossIconContainerStyled>
                    <TouchableHighlight
                      underlayColor="#ffffff00"
                      onPress={() => {
                        track('Chat setModalUsers pressed', {
                          userid: user.userid,
                          circleid: users[0].circleid,
                          eventid: users[0].eventid,
                        });
                        setModalUsers(!modalUsers);
                      }}>
                      <CrossIconStyled name={'closecircle'} />
                    </TouchableHighlight>
                  </CrossIconContainerStyled>
                </IconContainer>
                {isLoadingLocation && (
                  <ActivityIndicator
                    animating={isLoadingLocation}
                    size="large"
                    color={'#05EA00'}
                  />
                )}
                {!isLoadingLocation && (
                  <ButtonWrapper>
                    <ShareLocationWrapper onPress={() => shareLocation()}>
                      <ReportText>Share Location</ReportText>
                    </ShareLocationWrapper>
                  </ButtonWrapper>
                )}
                {users &&
                  users.map((u, i) => {
                    if (isUserBlocked(user, u.userid)) {
                      return <View key={u.userid} />;
                    }
                    var a = moment();
                    var b = moment(
                      u.user.profile.ageyear +
                        '/' +
                        u.user.profile.agemonth +
                        '/' +
                        u.user.profile.ageday,
                      'YYYY',
                    );
                    const age = a.diff(b, 'years');
                    // console.log(age);
                    return (
                      <View key={u.userid}>
                        <ImageContainer>
                          <ImageWrapper
                            source={{
                              uri: !u.user.profile.photo
                                ? 'https://i.vimeocdn.com/portrait/58832_300x300.jpg'
                                : u.user.profile.photo,
                            }}
                          />
                        </ImageContainer>
                        <TextMainWrapper>
                          <CountWrapper>
                            <TitleText
                              fontSize={'25px'}
                              text={(i + 1).toString()}
                              color="#fff"
                            />
                          </CountWrapper>
                          <UserDetailWrapper>
                            <TitleText
                              fontSize={'22px'}
                              text={u.user.profile.name}
                              color="#000"
                            />
                            <BirthDateWrapper>
                              <TitleText
                                fontSize={'14px'}
                                text={age + ' years old'}
                                color="rgba(0, 0, 0, 0.45)"
                              />
                              <ButtonWrapper>
                                {u.userid !== user.userid ? (
                                  <ReportWrapper
                                    onPress={() =>
                                      blockUser(u.user.profile.name, u.userid)
                                    }>
                                    <ReportText>Block</ReportText>
                                  </ReportWrapper>
                                ) : null}
                                {u.userid !== user.userid ? (
                                  <ReportWrapper
                                    onPress={() =>
                                      reportUser(u.user.profile.name, u.userid)
                                    }>
                                    <ReportText>Report</ReportText>
                                  </ReportWrapper>
                                ) : null}
                              </ButtonWrapper>
                            </BirthDateWrapper>
                          </UserDetailWrapper>
                        </TextMainWrapper>
                        <InterestWrapper>
                          {u.user &&
                            u.user.userinterest &&
                            u.user.userinterest.map((int) => {
                              return (
                                <Interest key={int.interestid}>
                                  <TitleText
                                    fontSize={'15px'}
                                    text={int.interest.name}
                                    color="#fff"
                                  />
                                </Interest>
                              );
                            })}
                        </InterestWrapper>
                      </View>
                    );
                  })}
              </ScrollView>
            </SafeAreaViewWrapper>
          </InnerView>
        </MainViewWrapper>
      </Modal>
      <BorderView />
      <TitleText
        title={true}
        text={event}
        fontSize={'24px'}
        color={'#05EA00'}
        textAlign={'center'}
      />
      <ChatView>
        <GiftedChat
          messages={allMessages}
          onSend={(mes) => onSendMessage(mes)}
          renderBubble={renderBubble}
          renderCustomView={renderCustomView}
          user={userMe}
          alignTop={true}
          maxInputLength={1000}
        />
      </ChatView>
    </MainWrapper>
  );
};

ChatScreen.defaultProps = defaultProps;
ChatScreen.propTypes = propTypes;
