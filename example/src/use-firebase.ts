import { useMultichannelWidget } from '@qiscus-community/react-native-multichannel-widget';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { useRef } from 'react';
import useAsyncEffect from 'use-async-effect';
import PushNotification from 'react-native-push-notification';

export function useFirebase() {
  const app = useRef(firebase.app);
  const widget = useMultichannelWidget();

  useAsyncEffect(async () => {
    // firebase.initializeApp();

    widget.setDeviceId?.(await firebase.messaging().getToken());

    const permission = await messaging().requestPermission();
    if (permission === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log('has permission', permission);
    }

    messaging().setBackgroundMessageHandler(async (message) => {
      console.log('[Firebase] Received background message ', message);
      console.log('@fcm.message', message);
      let payload = JSON.parse(message.data?.payload ?? '{}');
      console.log('payload:', payload);
      PushNotification.localNotification({
        message: payload.message,
        allowWhileIdle: true,
        channelId: 'general',
        title: 'New message',
      });
    });

    PushNotification.channelExists('general', (exists: boolean) => {
      if (!exists) {
        PushNotification.createChannel(
          {
            channelId: 'general',
            channelName: 'General',
          },
          (created: boolean) => {
            console.log('channel created', created);
          }
        );
      }
    });

    const subs = messaging().onMessage(async (message) => {
      console.log('@fcm.message', message);
      let payload = JSON.parse(message.data?.payload ?? '{}');
      console.log('payload:', payload);
      PushNotification.localNotification({
        message: payload.message,
        allowWhileIdle: true,
        channelId: 'general',
        title: 'New message',
      });
    });

    return () => subs?.();
  }, [widget.setDeviceId]);

  return app.current;
}
