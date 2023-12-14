import {createRef} from 'react';
import * as CommonActions from '@react-navigation/routers/src/CommonActions';
import {StackActions} from '@react-navigation/native';
import {checkCircle} from '../core';

export const isReadyRef = createRef();
export const navigationRef = createRef();

const navigateToCircleFromBackground = (circleUsers) => {
  console.log('navigateToCircleFromBackground');
  if (!isReadyRef.current || !navigationRef.current) {
    console.log(
      'isReadyRef or navigationRef not ready',
      isReadyRef.current,
      navigationRef.current,
    );
    // return;
  }

  // Get current route
  const currentRoute = navigationRef.current?.getCurrentRoute();
  // console.log('currentRoute', currentRoute);
  console.log('currentRoute name', currentRoute?.name);
  // If this Chat get circleid
  if (currentRoute?.name === 'Chat') {
    const firstUser = currentRoute.params.users[0];
    // If circle not equal circleid from notification go to right chat
    console.log('right chat', firstUser.circleid === circleUsers[0].circleid);
    if (firstUser.circleid !== circleUsers[0].circleid) {
      navigationRef?.current?.dispatch(StackActions.pop());
      navigationRef?.current?.dispatch(
        StackActions.push('Chat', {
          users: circleUsers,
        }),
      );
    }
  } else {
    navigateToCircle(circleUsers);
  }
};

const navigateToCircle = (circleUsers) => {
  console.log('navigateToCircle');
  console.log('navigationRef', navigationRef);
  console.log('navigationRef.current', navigationRef.current);
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [
        {
          name: 'Circles',
          //   animationEnabled: false,
          params: {
            fromNotification: true,
          },
        },
        {
          name: 'Chat',
          //   animationEnabled: false,
          params: {
            users: circleUsers,
          },
        },
      ],
    }),
  );
};

export const moveToCircle = async (token, circleId) => {
  const circleUsers = await checkCircle(token, circleId);
  navigateToCircleFromBackground(circleUsers);
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const moveToEventMatched = async (eventname, eventid) => {
  await sleep(500); // waiting to be able to open the circles from killed mode
  console.log('moveToEventMatched');
  console.log('navigationRef', navigationRef);
  console.log('navigationRef.current', navigationRef.current);
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [
        {
          name: 'Events',
        },
        {
          name: 'EventMatched',
          params: {
            id: eventid,
            title: eventname,
          },
        },
      ],
    }),
  );
};

export const moveToEvent = async (eventid) => {
  console.log('moveToEvent');
  console.log('navigationRef', navigationRef);
  console.log('navigationRef.current', navigationRef.current);
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [
        {
          name: 'Events',
        },
        {
          name: 'Event',
          params: {
            id: eventid,
          },
        },
      ],
    }),
  );
};
