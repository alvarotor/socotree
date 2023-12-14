/**
 * @format
 */

import {AppRegistry} from 'react-native';
import VideoCall from './VideoCall';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => VideoCall);
AppRegistry.registerComponent(appName, () => App);
