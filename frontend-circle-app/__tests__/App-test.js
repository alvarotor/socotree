/**
 * @format
 */

import 'react-native';
import React from 'react';
// import App from '../App';
import Health from '../components/health';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

// jest.useFakeTimers();
// jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter.js', () => {
//   const {EventEmitter} = require('events');
//   return EventEmitter;
// });
// jest.mock('@react-native-firebase/messaging', () => {
//   return () => ({
//     hasPermission: jest.fn(() => Promise.resolve(true)),
//     subscribeToTopic: jest.fn(),
//     unsubscribeFromTopic: jest.fn(),
//     requestPermission: jest.fn(() => Promise.resolve(true)),
//     getToken: jest.fn(() => Promise.resolve('myMockToken')),
//     onMessage: jest.fn(),
//     onNotificationOpenedApp: jest.fn(),
//     getInitialNotification: jest.fn(() => Promise.resolve(false)),
//   });
// });
// jest.mock('@react-native-firebase/auth', () => {
//   return () => ({
//     onAuthStateChanged: jest.fn(),
//     signInWithEmailAndPassword: jest.fn(),
//     createUserWithEmailAndPassword: jest.fn(),
//     signOut: jest.fn(),
//     sendPasswordResetEmail: jest.fn(),
//   });
// });

it('Health renders correctly', async () => {
  renderer.create(<Health />);
});
