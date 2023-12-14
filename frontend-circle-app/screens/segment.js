import analytics from '@segment/analytics-react-native';
import firebase from '@segment/analytics-react-native-firebase';
import ENV from '../env';
import active from '../active.env';
import {Platform} from 'react-native';
var HOST = ` - ${Platform.OS} - ${active}`;

export const setSegment = async () => {
  await analytics.setup(ENV.SEGMENT_KEY, {
    using: [firebase],
    // Record screen views automatically!
    recordScreenViews: true,
    // Record certain application events automatically!
    trackAppLifecycleEvents: true,
  });
};

export const identify = async (id, email, profile) => {
  const {
    name,
    photo,
    ageyear,
    agemonth,
    ageday,
    phone,
    phoneprefix,
    newsupdate,
    profession,
    district,
    login,
    pushnotificationswitch,
    logged,
    emailsswitch,
    fcmtoken,
    build,
    platform,
  } = profile;

  await analytics.identify(id, {
    email,
    name,
    photo,
    profession,
    district,
    login,
    phone,
    phoneprefix,
    newsupdate,
    ageyear,
    agemonth,
    ageday,
    fcmtoken,
    pushnotificationswitch,
    emailsswitch,
    logged,
    build,
    platform,
  });
};

export const trackScreen = async (screenName, userid) => {
  await analytics.screen(screenName + HOST, {
    userid,
  });
};

export const trackGroup = async (circleid, circleData) => {
  await analytics.group(circleid + HOST, circleData);
};

export const track = async (name, data) => {
  await analytics.track(name + HOST, data);
};
