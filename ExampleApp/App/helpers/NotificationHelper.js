import * as PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NotificationHandler = async (message) => {
  addNotificationBadge();
  return Promise.resolve();
};

export const addNotificationBadge = () => {
  try {
    AsyncStorage.getItem('notif')
      .then(value => {
        if (value !== null) {
          let count = parseInt(value) + 1;
          PushNotification.setApplicationIconBadgeNumber(count);
          AsyncStorage.setItem('notif', count.toString());
          console.log(count);
        } else {
          AsyncStorage.setItem('notif', '1'.toString());
          PushNotification.setApplicationIconBadgeNumber(1);
        }
      });
  } catch (e) {
  }
};

export const clearNotification = () => {
  PushNotification.removeAllDeliveredNotifications();
  AsyncStorage.setItem('notif', '0'.toString());
  PushNotification.setApplicationIconBadgeNumber(0);
};
