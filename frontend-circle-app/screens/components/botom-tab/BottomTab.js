import React, {useContext} from 'react';
import {defaultProps, propTypes} from './props';
import {
  BottomContainer,
  BottomIconFA,
  BottomIconM,
  BottomIconE,
  BottomIconMCI,
  IconContainer,
  TabText,
} from './styled';
import * as CommonActions from '@react-navigation/routers/src/CommonActions';
import {UserContext} from '../../UserContext';
import {useUserIsRegistered} from '../useUserIsRegistered';

export const BottomTab = ({
  isEvents,
  isMyEvents,
  isProfile,
  isChat,
  isContact,
  navigation,
}) => {
  const {user} = useContext(UserContext);
  const profileDone = useUserIsRegistered(user);

  return (
    <BottomContainer>
      <IconContainer
        onPress={() =>
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Events'}],
            }),
          )
        }>
        <BottomIconMCI
          name="calendar-month"
          color={isEvents ? '#05EA00' : '#C4C4C4'}
        />
        <TabText color={isEvents ? '#05EA00' : '#C4C4C4'}>Events</TabText>
      </IconContainer>
      <IconContainer
        onPress={() =>
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'EventsReminded'}],
            }),
          )
        }>
        <BottomIconM
          name="event-available"
          color={isMyEvents ? '#05EA00' : '#C4C4C4'}
        />
        <TabText color={isMyEvents ? '#05EA00' : '#C4C4C4'}>Reminders</TabText>
      </IconContainer>
      <IconContainer
        onPress={() =>
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Circles'}],
            }),
          )
        }>
        <BottomIconE name="chat" color={isChat ? '#05EA00' : '#C4C4C4'} />
        <TabText color={isChat ? '#05EA00' : '#C4C4C4'}>Circles</TabText>
      </IconContainer>
      <IconContainer
        onPress={() => {
          if (!profileDone) {
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: isEvents
                      ? 'Events'
                      : isMyEvents
                      ? 'EventsReminded'
                      : isProfile
                      ? 'Profile'
                      : isChat
                      ? 'Circles'
                      : isContact
                      ? 'ContactUs'
                      : 'Events',
                  },
                  {
                    name: 'EditProfile',
                  },
                ],
              }),
            );
          } else {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Profile'}],
              }),
            );
          }
        }}>
        <BottomIconFA
          name="user-circle"
          color={isProfile ? '#05EA00' : '#C4C4C4'}
        />
        <TabText color={isProfile ? '#05EA00' : '#C4C4C4'}>Profile</TabText>
      </IconContainer>
      <IconContainer
        onPress={() =>
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'ContactUs'}],
            }),
          )
        }>
        <BottomIconM
          name="contact-support"
          color={isContact ? '#05EA00' : '#C4C4C4'}
        />
        <TabText color={isContact ? '#05EA00' : '#C4C4C4'}>Contact Us</TabText>
      </IconContainer>
    </BottomContainer>
  );
};

BottomTab.defaultProps = defaultProps;
BottomTab.propTypes = propTypes;
