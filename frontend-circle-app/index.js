import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {ErrorBoundary} from 'react-error-boundary';
import {View, StyleSheet, Button, Text} from 'react-native';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';
import crashlytics from '@react-native-firebase/crashlytics';
import AsyncStorage from '@react-native-community/async-storage';
import {configurePushNotifications} from './screens/notifications';
import {track} from './screens/segment';

setJSExceptionHandler(async (error, isFatal) => {
  // This is your custom global error handler
  // You do stuff like show an error dialog
  // or hit google analytics to track crashes
  // or hit a custom api to inform the dev team.
  console.error('setJSExceptionHandler');
  if (!error) {
    return;
  } else {
    console.error(error);
    console.error(isFatal);
    crashlytics().recordError(new Error(error));
    track('ERROR', {message: JSON.stringify(error)});
  }
}, true);

const exceptionhandler = (exceptionString) => {
  // your exception handler code here
  console.error('exceptionString');
  if (!exceptionString) {
  } else {
    console.error(exceptionString);
    crashlytics().recordError(new Error(exceptionString));
    track('ERROR', {message: JSON.stringify(exceptionString)});
  }
};

setNativeExceptionHandler(
  exceptionhandler,
  false, // 'forceAppQuit',
  true, //'executeDefaultHandler',
);

const myErrorHandler = (error) => {
  // Do something with the error
  // E.g. reporting errorr using sentry ( see part 3)
  console.error('myErrorHandler');
  if (!error) {
    return;
  } else {
    console.error(error);
    crashlytics().recordError(new Error(error));
    track('ERROR', {message: JSON.stringify(error)});
  }
};

async function ErrorFallback({resetErrorBoundary}) {
  await AsyncStorage.removeItem('loginUser');
  return (
    <View style={[styles.container]}>
      <View>
        <Text>Something went wrong:</Text>
        <Button title="Try Again" onPress={resetErrorBoundary} />
      </View>
    </View>
  );
}

export const ErrorHandler = ({children}) => (
  <ErrorBoundary FallbackComponent={ErrorFallback} onError={myErrorHandler}>
    {children}
  </ErrorBoundary>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: 12,
  },
});

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }
  return (
    <ErrorHandler>
      <App />
    </ErrorHandler>
  );
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);

configurePushNotifications();
