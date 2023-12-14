import React, {useContext, useEffect, useState} from 'react';
import {defaultProps, propTypes} from '../components/propsNavigation';
import {AppHeader} from '../components/app-header';
import {BottomTab} from '../components/botom-tab';
import {TitleText} from '../components/title-text';
import {
  MainViewWrapper,
  InnerWrapper,
  MainWrapper,
  ImageWrapper,
  ActivityIndicator,
} from '../components/GlobalStyles';
import {
  ImageContainer,
  TextWrapper,
  EventText,
  DateWrapper,
  IconStyled,
  DescriptionText,
  StartContainer,
  JoinNowText,
  OnlyText,
  UpcomingWrapper,
  InnerViewUpper,
} from './styled';
import {FlatList, Platform} from 'react-native';
import {Template} from '../components/keyboard-safe-view';
import {UserContext} from '../UserContext';
import {getEvents, timeUTC} from '../../core/events';
import moment from 'moment';
import {trackScreen, identify} from '../segment';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-toast-message';
import {updateUserData} from '../../core';
import {updateVersion} from '../../core/system';

export const EventsScreen = ({navigation}) => {
  const {user, setUser} = useContext(UserContext);

  if (!user || user === {} || !user.token) {
    navigation.navigate('Start');
  }

  const nowTime = () =>
    parseInt(
      new Date().getHours().toString() + new Date().getMinutes().toString(),
      10,
    );

  const [allEvents, setAllEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [lastMin, setLastMin] = useState(nowTime());

  useEffect(() => {
    trackScreen('Circles', user.userid);
  });

  useEffect(() => {
    const buildNumber = DeviceInfo.getBuildNumber();

    const checkUpdateVersion = async () => {
      const version = await updateVersion();
      if (
        (Platform.OS === 'android' &&
          buildNumber < version.androidbuildforced) ||
        (Platform.OS === 'ios' && buildNumber < version.iosbuildforced)
      ) {
        navigation.navigate('UpdateApp');
      } else if (
        (Platform.OS === 'android' && buildNumber < version.androidbuild) ||
        (Platform.OS === 'ios' && buildNumber < version.iosbuild)
      ) {
        Toast.show({
          text1: 'New update with new features available!',
          text2: 'Please update to the new version as soon as you can.',
        });
      }
    };

    const updatedBuild = async () => {
      const updatedBuildUser = {
        ...user,
        profile: await updateUserData(user),
      };
      setUser(updatedBuildUser);
      await identify(user.userid, user.email, updatedBuildUser.profile);
    };

    if (!user.profile.build || user.profile.build < buildNumber) {
      updatedBuild(user);
    }

    checkUpdateVersion();
  }, [navigation, setUser, user]);

  const getAllEvents = async (isMounted) => {
    const res = await getEvents();

    if (!isMounted) {
      return;
    }

    // console.log('getAllEvents', res);
    const timeFormatDate = 'dddd, MMMM Do';
    const timeFormat = 'HH:mm';
    const resEvents = res.map((e) => {
      const time = timeUTC(e.eventtime);
      const mTime = moment(time);
      return {
        ...e,
        date: mTime.format(timeFormatDate),
        time: mTime.format(timeFormat),
        startsIn: mTime.fromNow(),
        image: e.picture
          ? {
              uri: `https://s3.eu-central-1.amazonaws.com/circles.berlin/${e.picture}`,
            }
          : require('../components/images/test.jpg'),
      };
    });

    setIsLoadingEvents(false);
    setAllEvents(resEvents);
  };

  useEffect(() => {
    trackScreen('Events', user.userid);
  });

  useEffect(() => {
    let isMounted = true;
    const interval = setInterval(async () => {
      // console.log('Events ' + lastMin);
      // console.log(nowTime(), nowTime() === lastMin);
      if (nowTime() !== lastMin) {
        setLastMin(nowTime());
        await getAllEvents(isMounted);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      isMounted = false;
    };
  }, [lastMin]);

  useEffect(() => {
    let isMounted = true;
    getAllEvents(isMounted);

    return () => {
      isMounted = false;
    };
  }, []);

  const onClickEvent = (id) => navigation.navigate('Event', {id});

  const renderEvent = (item, index) => {
    return (
      <InnerWrapper key={index}>
        <UpcomingWrapper onPress={() => onClickEvent(item.uuid)}>
          <ImageContainer>
            <ImageWrapper source={item.image} />
          </ImageContainer>
          <TextWrapper>
            <DateWrapper>
              <EventText>{item.date.toUpperCase()}</EventText>
              <IconStyled name="clockcircleo" />
              <EventText>{item.time}</EventText>
            </DateWrapper>
            <TitleText
              onPress={() => onClickEvent(item.uuid)}
              title={true}
              text={item.name}
            />
            <DescriptionText>{item.smalldescription}</DescriptionText>
          </TextWrapper>
          <StartContainer>
            <JoinNowText>STARTS</JoinNowText>
            <OnlyText>{item.startsIn}</OnlyText>
          </StartContainer>
        </UpcomingWrapper>
      </InnerWrapper>
    );
  };

  return (
    <Template>
      <MainViewWrapper>
        <MainWrapper>
          <AppHeader
            navigation={navigation}
            backgroundColor={'#F2FFF2'}
            leftButton={{isHidden: true}}
          />
          <InnerViewUpper>
            <TitleText title={true} text="Next Events" />
            <ActivityIndicator
              animating={isLoadingEvents}
              size="large"
              color={'#05EA00'}
            />
            <FlatList
              data={allEvents}
              contentContainerStyle={{paddingBottom: 30}}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps={'handled'}
              keyExtractor={(item) => item.uuid}
              renderItem={({item, index}) => renderEvent(item, index)}
            />
          </InnerViewUpper>
          <BottomTab isEvents={true} navigation={navigation} />
        </MainWrapper>
      </MainViewWrapper>
    </Template>
  );
};

EventsScreen.defaultProps = defaultProps;
EventsScreen.propTypes = propTypes;
