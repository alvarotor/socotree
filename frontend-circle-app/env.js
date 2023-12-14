import {Platform} from 'react-native';

import active from './active.env';
const uri = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2';

const envs = {
  staging: {
    API: 'https://apidev.circles.berlin/',
    APIWS: 'wss://apidev.circles.berlin/',
    APIPHOTO: (photoname) =>
      `https://s3.eu-central-1.amazonaws.com/circles.berlin/${photoname}`,
    APIUPLOAD: `https://apidev.circles.berlin/api/v1/upload${
      Platform.OS === 'android' ? '' : '64'
    }/`,
    API_TWILIO_TOKEN: 'https://apidev.circles.berlin/twilio_token/',
    SEGMENT_KEY: 'GHYPOqGnraLKVOeEqlI7yc2WOErGyciS',
  },
  prod: {
    API: 'https://api.circles.berlin/',
    APIWS: 'wss://api.circles.berlin/',
    APIPHOTO: (photoname) =>
      `https://s3.eu-central-1.amazonaws.com/circles.berlin/${photoname}`,
    APIUPLOAD: `https://api.circles.berlin/api/v1/upload${
      Platform.OS === 'android' ? '' : '64'
    }/`,
    API_TWILIO_TOKEN: 'https://api.circles.berlin/twilio_token/',
    SEGMENT_KEY: 'GHYPOqGnraLKVOeEqlI7yc2WOErGyciS',
  },
  dev: {
    API: `http://${uri}/`,
    APIWS: `ws://${uri}/`,
    APIPHOTO: (photoname) =>
      `https://s3.eu-central-1.amazonaws.com/circles.berlin/${photoname}`,
    APIUPLOAD: `http://${uri}/api/v1/upload${
      Platform.OS === 'android' ? '' : '64'
    }/`,
    API_TWILIO_TOKEN: `http://${uri}/twilio_token/`,
    SEGMENT_KEY: 'GHYPOqGnraLKVOeEqlI7yc2WOErGyciS',
  },
};

export default envs[active];
