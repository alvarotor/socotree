import React, {useState, useEffect, useContext, useRef} from 'react';
import {defaultProps, propTypes} from '../components/props';
import {EventHeader} from '../components/event-header';
import {TitleText} from '../components/title-text';
import {
  InputFieldWrapper,
  MainViewWrapper,
  InnerView,
  ButtonDoubleWrapper,
  GreyButtonFilledView,
  ButtonGreenFilledText,
} from '../components/GlobalStyles';
import {
  TitleWrapper,
  ConnectText,
  SubTitleText,
  IconStyled,
  RedButtonView,
} from './styled';
import {ScrollView} from 'react-native';
import {Template} from '../components/keyboard-safe-view';
import {ImportantPopUp} from '../components/ImportantPopUp';
import {getEvent, setUserEventJoin, timeUTC} from '../../core/events';
import moment from 'moment';
import * as CommonActions from '@react-navigation/routers/src/CommonActions';
import {UserContext} from '../UserContext';

export const EventBeginScreen = ({navigation, route}) => {
  const {id} = route.params;
  const {user} = useContext(UserContext);

  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleLeave, setIsVisibleLeave] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [secondsDisplay, setSecondsDisplay] = useState('00:00');
  const [matching, setMatching] = useState(false);
  const [event, setEvent] = useState({});

  useInterval(() => {
    if (seconds < 2 && !matching) {
      setMatching(true);
      setSeconds(10);
      setSecondsDisplay('Matching you, wait...');
    } else {
      const time = timeUTC(event.eventtime);
      const mTime = moment(time);
      setSeconds(mTime.diff(moment(), 'seconds', true).toFixed(0));
    }
    if (seconds < -10) {
      navigation.navigate('EventMatched', {
        title: event.name,
        type: event.type,
        id,
      });
    }
    if (matching) {
      setSecondsDisplay('Matching you, wait...');
    } else {
      setSecondsDisplay(toHHMMSS(seconds));
    }
    console.log(seconds);
  }, 1000);

  useEffect(() => {
    let isMounted = true;

    const getTheEvent = async () => {
      const res = await getEvent(id);

      if (!isMounted) {
        return;
      }
      // console.log(res);

      if (res.eventtime) {
        const timeFormat = 'HH:mm';
        const time = timeUTC(res.eventtime);
        const mTime = moment(time);
        res.time = mTime.format(timeFormat);
        setSeconds(mTime.diff(moment(), 'seconds', true).toFixed(0));
        setSecondsDisplay(res.time.toString());
      }
      // console.log(res);

      setEvent(res);
    };

    getTheEvent();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const onPressJoin = () => {
    setIsVisible(true);
  };

  const leaveEvent = async () => {
    const res = await setUserEventJoin(id, user.token);
    console.log('setUserEventJoin', res);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Events'}],
      }),
    );
  };

  const hideImportantPopUp = () => {
    setIsVisible(false);
  };

  const hideImportantPopUp2 = () => {
    setIsVisibleLeave(false);
  };

  return (
    <Template>
      <MainViewWrapper>
        <ImportantPopUp
          isVisible={isVisible}
          hideModal={hideImportantPopUp}
          type="1"
        />
        <ImportantPopUp
          isVisible={isVisibleLeave}
          hideModal={hideImportantPopUp2}
          leaveEvent={leaveEvent}
          type="2"
        />
        <EventHeader
          title={'Event starts in:'}
          time={secondsDisplay}
          backgroundColor={'#05ea00'}
          navigation={navigation}
        />
        <InnerView>
          <ScrollView showsVerticalScrollIndicator={false}>
            <InputFieldWrapper>
              <TitleText title={true} text={event.name} fontSize={'32px'} />
              <TitleWrapper>
                <SubTitleText>You have joined the event!</SubTitleText>
                <IconStyled name="checkbox" />
              </TitleWrapper>
              <SubTitleText>Wait here until the event begins</SubTitleText>
              <ConnectText>
                You will get matched into your circle at {event.time}.
              </ConnectText>
            </InputFieldWrapper>
          </ScrollView>
          <ButtonDoubleWrapper>
            <RedButtonView onPress={() => setIsVisibleLeave(true)}>
              <ButtonGreenFilledText>Leave the event</ButtonGreenFilledText>
            </RedButtonView>
            <GreyButtonFilledView onPress={() => onPressJoin()}>
              <ButtonGreenFilledText>
                {event.type === 0 ? 'Join Circle Chat' : 'Join Video Call'}
              </ButtonGreenFilledText>
            </GreyButtonFilledView>
          </ButtonDoubleWrapper>
        </InnerView>
      </MainViewWrapper>
    </Template>
  );
};

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    let id = setInterval(() => {
      savedCallback.current();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
};

const toHHMMSS = (seconds) => {
  var sec_num = parseInt(seconds, 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return hours + ':' + minutes + ':' + seconds;
};

EventBeginScreen.defaultProps = defaultProps;
EventBeginScreen.propTypes = propTypes;
