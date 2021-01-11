/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {NotificationHandler} from './App/helpers/NotificationHelper';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('ReactNativeFirebaseMessagingHeadlessTask', () => NotificationHandler);
