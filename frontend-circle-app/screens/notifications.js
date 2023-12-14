import {createRef} from 'react';
import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import {
  moveToCircle,
  moveToEvent,
  moveToEventMatched,
} from './navigationActions';

export const userRef = createRef();

export const onMessage = () =>
  messaging().onMessage((remoteMessage) => {
    console.log(Platform.OS, 'FCM onMessageNotification', remoteMessage);

    let title, body, userid, circleid, typepn, eventid, eventname;

    title = remoteMessage?.notification?.title;
    body = remoteMessage?.notification?.body;
    typepn = remoteMessage?.data?.typepn;
    userid = remoteMessage?.data?.userid;
    circleid = remoteMessage?.data?.circleid;
    eventid = remoteMessage?.data?.eventid;
    eventname = remoteMessage?.data?.eventname;

    console.log('title', title);
    console.log('body', body);
    console.log('typepn', typepn);
    console.log('userid', userid);
    console.log('circleid', circleid);
    console.log('eventid', eventid);
    console.log('eventname', eventname);

    localNotification(body, title, remoteMessage?.data);
  });

export const onTokenRefresh = () =>
  messaging().onTokenRefresh(async (token) => {
    console.log(Platform.OS, 'onTokenRefresh', token);
    await AsyncStorage.setItem('fcmToken', token);
  });

export const requestUserPNPermissionAsync = async () => {
  const authorizationStatus = await messaging().requestPermission();

  if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    await AsyncStorage.setItem('fcmToken', await messaging().getToken())
      .then(async () => {
        // console.log(Platform.OS, await AsyncStorage.getItem('fcmToken'));
        console.log(Platform.OS, 'has notification permissions enabled.');
        return true;
      })
      .catch((e) => {
        console.log(
          Platform.OS,
          'has failed for provisional notification permissions.',
        );
        return false;
      });
  } else if (
    authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
  ) {
    console.log(Platform.OS, 'has provisional notification permissions.');
    return true;
  } else {
    console.log(Platform.OS, 'has notification permissions disabled');
    return false;
  }
};

const localNotification = (body, title, data) => {
  console.log('localNotification title', title);
  console.log('localNotification body', body);
  PushNotification.localNotification({
    bigText: body,
    subText: body,
    // ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
    /* iOS and Android properties */
    title: title,
    message: body,
    userInfo: {...data},
    data,
  });
};

const onNotification = (remoteMessage) => {
  console.log(
    Platform.OS,
    'onNotification background',
    userRef.current?.profile?.name,
  );

  // If message received on iOS and in foreground and user NO tap on message
  if (
    Platform.OS === 'ios' &&
    remoteMessage?.foreground &&
    !remoteMessage?.userInteraction
  ) {
    return;
  }

  console.log('background message', remoteMessage);
  console.log('logged', userRef.current?.profile?.logged);
  // console.log('user', userRef);
  console.log(
    'pushnotificationswitch',
    userRef.current?.profile?.pushnotificationswitch,
  );
  console.log('foreground', remoteMessage?.foreground);

  if (
    remoteMessage &&
    userRef.current?.profile?.logged &&
    userRef.current?.profile?.pushnotificationswitch
  ) {
    console.log(Platform.OS, 'open from background state');
    console.log('title', remoteMessage.title);
    console.log('body', remoteMessage.body);
    console.log('typepn', remoteMessage.data?.typepn);
    console.log('userid', remoteMessage.data?.userid);
    console.log('circleid', remoteMessage.data?.circleid);
    console.log('eventid', remoteMessage.data?.eventid);
    console.log('eventname', remoteMessage.data?.eventname);
    console.log('token', userRef.current?.token);
    console.log(
      'question',
      userRef.current?.token && remoteMessage.data?.circleid,
    );
    if (remoteMessage.data?.typepn === 'remindevent') {
      moveToEvent(remoteMessage.data?.circleid);
    } else if (
      userRef.current?.token &&
      remoteMessage.data?.eventid &&
      remoteMessage.data?.typepn === 'newcircle'
    ) {
      moveToEventMatched(
        remoteMessage.data?.eventname,
        remoteMessage.data?.eventid,
      );
    } else if (userRef.current?.token && remoteMessage.data?.circleid) {
      moveToCircle(userRef.current?.token, remoteMessage.data?.circleid);
    }
  }
};

export const configureOnNotificationOpenedApp = () => {
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log('onNotificationOpenedApp');
    onNotification(remoteMessage);
  });
};

export const configureGetInitialNotification = () => {
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      console.log('getInitialNotification');
      onNotification(remoteMessage);
    });
};

export const configurePushNotifications = () => {
  PushNotification.configure({
    onNotification,
  });
};
