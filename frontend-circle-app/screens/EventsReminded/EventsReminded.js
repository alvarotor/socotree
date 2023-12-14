import React, {useContext, useEffect, useState, useCallback} from 'react';
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
  NotYetText,
} from '../components/GlobalStyles';
import {
  ImageContainer,
  TextWrapper,
  EventText,
  DateWrapper,
  IconStyled,
  DescriptionText,
  StartContainer,
  OnlyText,
  JoinNowText,
  JoinContainer,
  JoinNowBlackText,
  SecondContainer,
  StartsText,
  UpcomingWrapper,
  InnerViewUpper,
} from './styled';
import {FlatList} from 'react-native';
import {Template} from '../components/keyboard-safe-view';
import {UserContext} from '../UserContext';
import {trackScreen} from '../segment';
import {getEvents, userEventsRemind, timeUTC} from '../../core/events';
import moment from 'moment';

export const EventsRemindedScreen = ({navigation}) => {
  const {user} = useContext(UserContext);

  if (!user || user === {} || !user.token) {
    navigation.navigate('Start');
  }

  const nowTime = () =>
    parseInt(
      new Date().getHours().toString() + new Date().getMinutes().toString(),
      10,
    );

  const [myEvents, setMyEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastMin, setLastMin] = useState(nowTime());

  useEffect(() => {
    trackScreen('My Events', user.userid);
  });

  const getMyEvents = useCallback(
    async (isMounted) => {
      const allEvents = await getEvents();
      const myEventsReg = await userEventsRemind(user.token);

      if (!isMounted) {
        return;
      }
      // console.log('allEvents', allEvents, allEvents.length);
      // console.log('getMyEvents', myEventsReg, myEventsReg.length);

      const resEvents = myEventsReg
        .map((event) => {
          return allEvents.filter(
            (allEvent) => event.eventid === allEvent.uuid,
          )[0];
        })
        .filter((e) => e !== undefined);
      // console.log('resEvents', resEvents, resEvents.length);

      const resEventsSort = resEvents.sort((a, b) => {
        return a.eventtime.year > b.eventtime.year
          ? 1
          : a.eventtime.year === b.eventtime.year
          ? a.eventtime.month > b.eventtime.month
            ? 1
            : a.eventtime.month === b.eventtime.month
            ? a.eventtime.day > b.eventtime.day
              ? 1
              : -1
            : -1
          : -1;
      });

      const timeFormatDate = 'dddd, MMMM Do';
      const timeFormat = 'HH:mm';
      const resMyEvents = resEventsSort.map((e) => {
        //console.log(e);
        const time = timeUTC(e.eventtime);
        const mTime = moment(time);
        return {
          ...e,
          date: mTime.format(timeFormatDate),
          time: mTime.format(timeFormat),
          minutes15: mTime.diff(moment(), 'minutes', true),
          startsIn: mTime.fromNow(),
          image: e.picture
            ? {
                uri: `https://s3.eu-central-1.amazonaws.com/circles.berlin/${e.picture}`,
              }
            : require('../components/images/test.jpg'),
        };
      });
      // console.log('resMyEvents', resMyEvents);

      setIsLoading(false);
      setMyEvents(resMyEvents);
    },
    [user.token],
  );

  useEffect(() => {
    let isMounted = true;
    const interval = setInterval(() => {
      // console.log('Events ' + lastMin);
      // console.log(nowTime(), nowTime() === lastMin);
      if (nowTime() !== lastMin) {
        setLastMin(nowTime());
        getMyEvents(isMounted);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
      isMounted = false;
    };
  }, [lastMin, getMyEvents]);

  useEffect(() => {
    let isMounted = true;
    getMyEvents(isMounted);
    return () => {
      isMounted = false;
    };
  }, [getMyEvents]);

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
            <TitleText title={true} text={item.name} />
            <DescriptionText>{item.smalldescription}</DescriptionText>
          </TextWrapper>
          {item.minutes15 > 15 ? (
            <StartContainer>
              <JoinNowText>STARTS</JoinNowText>
              <OnlyText>{item.startsIn}</OnlyText>
            </StartContainer>
          ) : (
            <>
              <JoinContainer>
                <JoinNowBlackText>JOIN NOW!</JoinNowBlackText>
              </JoinContainer>
              <SecondContainer>
                <StartsText>STARTS</StartsText>
                <StartsText>{item.startsIn}</StartsText>
              </SecondContainer>
            </>
          )}
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
            <TitleText title={true} text="Reminders" />
            <ActivityIndicator
              animating={isLoading}
              size="large"
              color={'#05EA00'}
            />
            {myEvents.length > 0 || isLoading ? (
              <FlatList
                data={myEvents}
                contentContainerStyle={{paddingBottom: 30}}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps={'handled'}
                keyExtractor={(item) => item.uuid}
                renderItem={({item, index}) => renderEvent(item, index)}
              />
            ) : (
              <NotYetText>
                You have no reminders set yet. If you set a reminder for an
                event it will show up here & you'll get notified when the event
                is opened to join.
              </NotYetText>
            )}
          </InnerViewUpper>
          <BottomTab isMyEvents={true} navigation={navigation} />
        </MainWrapper>
      </MainViewWrapper>
    </Template>
  );
};

EventsRemindedScreen.defaultProps = defaultProps;
EventsRemindedScreen.propTypes = propTypes;
