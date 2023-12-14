import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import {deviceData} from './screens/deviceData';
import {Routes} from './screens/routes';
import {UserContext} from './screens/UserContext';
import {
  requestUserPNPermissionAsync,
  configureOnNotificationOpenedApp,
  configureGetInitialNotification,
  onMessage,
  onTokenRefresh,
} from './screens/notifications';
import {setSegment} from './screens/segment';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onMessage();
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onTokenRefresh();
    return unsubscribe;
  }, []);

  useEffect(() => {
    const requestUserPNPermission = async () =>
      await requestUserPNPermissionAsync();

    const permissionsGranted = requestUserPNPermission();
    if (permissionsGranted) {
      configureOnNotificationOpenedApp();
      configureGetInitialNotification();
    }
    setSegment();
    deviceData();
    SplashScreen.hide();
  }, []);

  return (
    <>
      <UserContext.Provider value={{user, setUser}}>
        <Routes />
      </UserContext.Provider>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
};

export default App;
