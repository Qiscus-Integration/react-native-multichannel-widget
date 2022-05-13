import { PortalHost, PortalProvider, usePortal } from '@gorhom/portal';
import {
  MultichannelWidgetProvider,
  useCurrentUser,
  useMultichannelWidget,
} from '@qiscus-community/react-native-multichannel-widget';
import React, { useEffect } from 'react';
import {
  BackHandler,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Chat } from './Chat';
import { Login } from './Login';
import { useFirebase } from './use-firebase';
import messaging from '@react-native-firebase/messaging';

export const APP_ID = 'YOUR_APP_ID';
export const CHANNEL_ID = 'YOUR_CHANNEL_ID';

export default function Container() {
  return (
    <PortalProvider>
      <MultichannelWidgetProvider appId={APP_ID}>
        <App />
      </MultichannelWidgetProvider>
      <PortalHost name="portal-error" />
    </PortalProvider>
  );
}

function App() {
  useFirebase();

  const portal = usePortal();
  const widget = useMultichannelWidget();
  const currentUser = useCurrentUser();

  useEffect(() => {
    function listener(): boolean {
      if (currentUser != null) {
        widget.clearUser();
        return true;
      }

      return false;
    }
    BackHandler.addEventListener('hardwareBackPress', listener);
    return () => BackHandler.removeEventListener('hardwareBackPress', listener);
  }, [currentUser, widget]);

  return (
    <SafeAreaView style={styles.container}>
      <>
        {currentUser == null && (
          <Login
            onLogin={async (userId, displayName) => {
              widget.setUser({
                userId: userId,
                displayName: displayName,
              });
              widget.setChannelId(CHANNEL_ID);

              const deviceId = await messaging().getToken();
              widget.setDeviceId(deviceId);

              widget
                .initiateChat()
                .then(() => console.log('@sukses init'))
                .catch((e: any) => {
                  if (String(e).includes?.('appId')) {
                    console.log('appId error');
                    return;
                  }
                  console.log('@error init', e);
                  portal.addPortal(
                    'portal-error',
                    <View key="portal-error">
                      <Text>{String(e)}</Text>
                    </View>
                  );
                });
            }}
          />
        )}
        {currentUser != null && <Chat />}
      </>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 0,
  },
});
