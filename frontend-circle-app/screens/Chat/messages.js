import {Alert} from 'react-native';
import ENV from '../../env';
import fetchGraphQL from '../../api/fetch';

export const welcomeMessages = (firstMessage) => {
  const date =
    firstMessage && firstMessage.CreatedAt
      ? firstMessage.CreatedAt
      : new Date();
  return [
    // {
    //   _id: Math.round(Math.random() * 1000000),
    //   text: '',
    //   createdAt: new Date(),
    //   user: {
    //     _id: 2,
    //     name: 'Alvaro',
    //   },
    //   location: {longitude: 13.345362, latitude: 52.5107945},
    // },
    formatMessage(
      'Say "hi" to your Circle and check our meeting in person safety advices bellow: http://getcircles.com/meeting-in-person/',
      {
        _id: 'Socotree',
        name: '£$SocotreeLink@#',
        avatar: require('../components/images/logo_no_name.png'),
      },
      date,
    ),
    formatMessage(
      'You can chat or video call now with all people you got matched with.\nAgree with them where & when to meet up.',
      {
        _id: 'Socotree',
        name: '£$Socotree@#',
        avatar: require('../components/images/logo_no_name.png'),
      },
      date,
    ),
    formatMessage(
      'Welcome to your new circle!',
      {
        _id: 'Socotree',
        name: '£$Socotree@#',
        avatar: require('../components/images/logo_no_name.png'),
      },
      date,
    ),
  ];
};

export const formatMessage = (
  message,
  userMessage,
  createdAt,
  location,
  system,
) => {
  if (system) {
    return {
      _id: Math.round(Math.random() * 1000000),
      text: message,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      user: userMessage,
      system: true,
    };
  }
  if (location && location.startsWith('GPS@')) {
    const coord = location.substring(4).split(',');
    // console.log('formatMessage location', coord);
    return {
      _id: Math.round(Math.random() * 1000000),
      text: message,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      user: userMessage,
      location: {
        latitude: parseFloat(coord[0]),
        longitude: parseFloat(coord[1]),
      },
    };
  } else {
    return {
      _id: Math.round(Math.random() * 1000000),
      text: message,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      user: userMessage,
    };
  }
};

export const createCircleChat = async (eventid, circleid) => {
  const r = await fetch(
    `${ENV.API}messages/v2/circle_event_app/${eventid}@${circleid}`,
  ).catch((error) => {
    Alert.alert('Error connecting to chat', error.message || error);
    console.log(error);
    return false;
  });
  const d = await r.json();
  if (d.success) {
    console.log(d);
    return new Promise.resolve(true);
  }
  return new Promise.reject(false);
};

export const circleGetMessages = async (circleid, token) => {
  const res = await fetchGraphQL(
    `{
      messages(circleid: "${circleid}") {
        created
        message
        userid
      }
    }`,
    '',
    token,
  );
  if (res && res.data && res.data.messages) {
    return new Promise.resolve(res.data.messages);
  } else {
    return new Promise.reject(res?.data?.errors);
  }
};

export const sendMessage = async (circleid, message, token) => {
  const res = await fetchGraphQL(
    `mutation {
      message(circleid: "${circleid}", message:"${message}")
    }`,
    '',
    token,
  );
  if (res && res.data && res.data.message) {
    return new Promise.resolve(res.data.message);
  } else {
    return new Promise.reject(res?.data?.errors);
  }
};
