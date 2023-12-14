import React, {
  useContext,
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from 'react-native-twilio-video-webrtc';
import {
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Dimensions,
  ActivityIndicator,
  BackHandler,
  Text,
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import {Separator} from '../components/GlobalStyles';
import {styles, VideoIcon, AwesomeIcon} from './styled';
const screenWidth = Dimensions.get('window').width;
const screenHight = Dimensions.get('window').height;
import {HeaderView, IconArrowMain, IconStyled} from '../Chat/styled';
import {UserContext} from '../UserContext';
import ENV from '../../env';
import {trackScreen, track} from '../segment';
import {InterestPopup} from './InterestPopup';
import moment from 'moment';

export const GroupVideoChatScreen = ({navigation, route}) => {
  const {circleid, users} = route.params;
  // console.log('GVC circleid', circleid);
  // console.log('users', users);
  const {user} = useContext(UserContext);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isPopUpInterestsVisible, setIsPopUpInterestsVisible] = useState(false);
  const [videoButtonsVisibility, setVideoButtonsVisibility] = useState(true);
  const [status, setStatus] = useState('disconnected');
  const [videoTracks, setVideoTracks] = useState(new Map());
  const [time] = useState({
    seconds: new Date().getSeconds(),
    minutes: new Date().getMinutes(),
    hours: new Date().getHours(),
  });

  useEffect(() => {
    trackScreen('GroupVideoChat', user.userid);
    return () => {
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const day = new Date().getDate();
      const started = new Date(
        year,
        month,
        day,
        time.hours,
        time.minutes,
        time.seconds,
      );
      const total_seconds = moment
        .duration(
          moment(new Date(), 'YYYY/MM/DD HH:mm:ss').diff(
            moment(started, 'YYYY/MM/DD HH:mm:ss'),
          ),
        )
        .asSeconds();
      // console.log(started);
      // console.log(new Date());
      // console.log(total_seconds);
      track('Time in Video Conference', {
        userid: user.userid,
        hours: time.hours,
        minutes: time.minutes,
        seconds: time.seconds,
        finish_seconds: new Date().getSeconds(),
        finish_minutes: new Date().getMinutes(),
        finish_hours: new Date().getHours(),
        total_seconds: total_seconds,
        total_minutes: total_seconds / 60,
        circleid,
      });
    };
  }, [circleid, user.userid, time.hours, time.minutes, time.seconds]);

  const twilioRef = useRef(null);

  useEffect(() => {
    const _requestAudioPermission = () => {
      track('Connecting to video call - PERMISSIONS.RECORD_AUDIO', {
        userid: user.userid,
        circleid,
      });
      return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Need permission to access microphone',
          message: 'To connect we need permission to access your microphone',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
    };

    const _requestCameraPermission = () => {
      track('Connecting to video call - PERMISSIONS.CAMERA', {
        userid: user.userid,
        circleid,
      });
      return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: 'Need permission to access camera',
        message: 'To connect we need permission to access your camera',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });
    };

    const getRemoteToken = () => {
      const URL = `${ENV.API_TWILIO_TOKEN}getToken?roomName=${circleid}&userid=${user.userid}`;
      fetch(URL)
        .then((response) => response.json())
        .then((json) => {
          track('Connecting to video call', {
            userid: user.userid,
            circleid,
          });
          twilioRef.current.connect({
            roomName: circleid,
            accessToken: json,
          });
          setStatus('connecting');
        })
        .catch((err) => {
          console.log('Request Failed', err);
        });
    };

    const getPermissions = async () => {
      const audioPermission = await _requestAudioPermission();
      console.log('audioPermission', audioPermission);
      const cameraPermission = await _requestCameraPermission();
      console.log('cameraPermission', cameraPermission);
      if (audioPermission === 'granted' && cameraPermission === 'granted') {
        getRemoteToken();
      }
    };

    if (Platform.OS === 'android') {
      getPermissions();
    } else {
      getRemoteToken();
    }
  }, [circleid, user.userid]);

  const onEndButtonPress = useCallback(() => {
    console.log('Trying to leave...');
    track('Video call - onEndButtonPress', {
      userid: user.userid,
      circleid,
    });
    BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
    twilioRef.current.disconnect();
    navigation.goBack();
    setStatus('disconnected');
    console.log('Leaving...');
  }, [backButtonHandler, navigation, circleid, user.userid]);

  const onMuteButtonPress = () => {
    track('Video call - onMuteButtonPress', {
      userid: user.userid,
      circleid,
    });
    twilioRef.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then((isEnabled) => setIsAudioEnabled(isEnabled));
  };

  const onShowInterestPress = () =>
    setIsPopUpInterestsVisible(!isPopUpInterestsVisible);

  const onPressVideoView = () =>
    setVideoButtonsVisibility(!videoButtonsVisibility);

  const onToggleVideoButtonPress = () => {
    track('Video call - onToggleVideoButtonPress', {
      userid: user.userid,
      circleid,
    });
    twilioRef.current
      .setLocalVideoEnabled(!isVideoEnabled)
      .then((isEnabled) => setIsVideoEnabled(isEnabled));
  };

  const onFlipButtonPress = () => {
    track('Video call - onFlipButtonPress', {
      userid: user.userid,
      circleid,
    });
    twilioRef.current.flipCamera();
  };

  const onRoomDidConnect = ({roomName, error}) => {
    track('Video call - onRoomDidConnect', {
      userid: user.userid,
      circleid,
    });
    console.log('onRoomDidConnect: ', roomName);
    setStatus('connected');
  };

  const onRoomDidDisconnect = ({roomName, error}) => {
    track('Video call - onRoomDidDisconnect', {
      userid: user.userid,
      circleid,
    });
    console.log('[Disconnect]ERROR: ', error);
    setStatus('disconnected');
  };

  const onRoomDidFailToConnect = (error) => {
    track('Video call - onRoomDidFailToConnect', {
      userid: user.userid,
      circleid,
    });
    console.log('[FailToConnect]ERROR: ', error);
    setStatus('disconnected');
  };

  useEffect(() => {
    console.log('************hardwareBackPress subscribed in video');
    BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
  }, [backButtonHandler]);

  const backButtonHandler = useCallback(() => {
    console.log('---*****backButtonHandler called in video');
    onEndButtonPress();
    return true;
  }, [onEndButtonPress]);

  const onParticipantAddedVideoTrack = ({participant, track}) => {
    console.log('onParticipantAddedVideoTrack: ', participant, track);
    setVideoTracks(
      new Map([
        ...videoTracks,
        [
          track.trackSid,
          {participantSid: participant.sid, videoTrackSid: track.trackSid},
        ],
      ]),
    );
  };

  const onParticipantRemovedVideoTrack = ({participant, track}) => {
    console.log('onParticipantRemovedVideoTrack: ', participant, track);

    const videoTracksLocal = videoTracks;
    videoTracksLocal.delete(track.trackSid);

    setVideoTracks(videoTracksLocal);
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <HeaderView>
          <IconArrowMain
            onPress={() => {
              onEndButtonPress();
            }}>
            <IconStyled name="arrowleft" />
          </IconArrowMain>
        </HeaderView>
      </View>
    );
  };

  const getStyles = (arraySize) => {
    console.log('arraySize---', arraySize);
    if (arraySize === 1) {
      return {width: '100%', height: '100%'};
    } else if (arraySize === 2) {
      return {width: '100%', height: screenHight / 2};
    } else if (arraySize === 3) {
      return {width: '50%', height: screenHight / 2};
    } else if (arraySize === 4) {
      return {width: '50%', height: screenHight / 2};
    } else if (arraySize === 5) {
      return {width: screenWidth / 3, height: screenHight / 2};
    } else {
      return {width: screenWidth / 3, height: screenHight / 3};
    }
  };

  const getLocalVideoContainerStyles = (arraySize) => {
    if (arraySize === 0) {
      return {...styles.optionsContainerTopPosition};
    } else if (arraySize === 1) {
      return {...styles.optionsContainerTopPosition};
    } else if (arraySize === 2) {
      return {...styles.optionsContainerTopPosition};
    } else if (arraySize === 3) {
      return {
        ...styles.optionsContainer,
        width: '50%',
        height: screenHight / 2 - (Platform.OS === 'android' ? 30 : 0),
      };
    } else if (arraySize === 4) {
      return {...styles.optionsContainerTopPosition};
    } else if (arraySize === 5) {
      return {
        ...styles.optionsContainer,
        width: screenWidth / 3,
        height: screenHight / 2 - (Platform.OS === 'android' ? 30 : 0),
      };
    } else {
      return {...styles.optionsContainer};
    }
  };

  const getLocalVideoStyles = (arraySize) => {
    if (arraySize === 0) {
      return;
    }

    if (arraySize === 1) {
      return {...styles.localVideoTopPosition};
    } else if (arraySize === 2) {
      return {...styles.localVideoTopPosition};
    } else if (arraySize === 3) {
      return {
        ...styles.localVideo,
        height: screenHight / 2 - (Platform.OS === 'android' ? 25 : 0),
      };
    } else if (arraySize === 4) {
      return {...styles.localVideoTopPosition};
    } else if (arraySize === 5) {
      return {
        ...styles.localVideo,
        height: screenHight / 2 - (Platform.OS === 'android' ? 25 : 0),
      };
    } else {
      return {...styles.localVideo};
    }
  };

  const renderVideoButtons = () => {
    return (
      <View style={[styles.btnRowContainer]}>
        <TouchableOpacity
          style={styles.soundOptionButton}
          onPress={onEndButtonPress}>
          <VideoIcon name={'call-end'} size={28} />
        </TouchableOpacity>
        <View style={styles.btnRowTopPosition}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={onFlipButtonPress}>
            <AwesomeIcon name={'exchange-alt'} size={22} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={onToggleVideoButtonPress}>
            <AwesomeIcon
              name={isVideoEnabled ? 'video' : 'video-slash'}
              size={22}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={onMuteButtonPress}>
            <AwesomeIcon
              name={isAudioEnabled ? 'microphone-alt' : 'microphone-alt-slash'}
              size={22}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={onShowInterestPress}>
            <AwesomeIcon name={'info'} size={22} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <InterestPopup
        isVisible={isPopUpInterestsVisible}
        onPressCross={onShowInterestPress}
        users={users}
      />
      <View style={styles.outerContainer}>
        <KeepAwake />
        {status === 'disconnected' && renderHeader()}
        <View style={styles.container}>
          {status === 'disconnected' && (
            <View style={styles.inputContainer}>
              <View>
                <Text>Waiting to connect to the video chat...</Text>
              </View>
              <Separator />
              <ActivityIndicator
                animating={true}
                color={'#0047ff'}
                size={'large'}
              />
            </View>
          )}
          {(status === 'connected' || status === 'connecting') && (
            <TouchableOpacity
              style={styles.callContainer}
              onPress={() => onPressVideoView()}>
              {videoTracks.size === 0 && (
                <View style={styles.container}>
                  <View style={styles.inputContainerUsers}>
                    <View>
                      <Text>
                        Waiting for the other user(s) to arrive in the video
                        call
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              {status === 'connected' && (
                <TouchableOpacity
                  style={styles.remoteGrid}
                  onPress={() => onPressVideoView()}>
                  {Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
                    return (
                      <TwilioVideoParticipantView
                        style={getStyles(videoTracks.size)}
                        key={trackSid}
                        trackIdentifier={trackIdentifier}
                      />
                    );
                  })}
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[getLocalVideoContainerStyles(videoTracks.size)]}
                onPress={() => onPressVideoView()}>
                <TwilioVideoLocalView
                  enabled={true}
                  style={[
                    styles.localVideoTopPosition,
                    getLocalVideoStyles(videoTracks.size),
                  ]}
                />
              </TouchableOpacity>
              {!isPopUpInterestsVisible &&
                videoButtonsVisibility &&
                renderVideoButtons()}
            </TouchableOpacity>
          )}
          <TwilioVideo
            maintainVideoTrackInBackground={true}
            ref={twilioRef}
            onRoomDidConnect={onRoomDidConnect}
            onRoomDidDisconnect={onRoomDidDisconnect}
            onRoomDidFailToConnect={onRoomDidFailToConnect}
            onParticipantAddedVideoTrack={onParticipantAddedVideoTrack}
            onParticipantRemovedVideoTrack={onParticipantRemovedVideoTrack}
          />
        </View>
      </View>
    </>
  );
};
