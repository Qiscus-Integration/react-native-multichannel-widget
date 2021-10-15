import {
  IAvatarConfig,
  IRoomSubtitleConfig,
  MultichannelWidget,
  MultichannelWidgetProvider,
  useCurrentUser,
  useMultichannelWidget,
} from '@qiscus-community/react-native-multichannel-widget';
import React, { useEffect } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet } from 'react-native';

export const APP_ID = 'YOUR_APP_ID';
export const CHANNEL_ID = 'YOUR_CHANNEL_ID';
export const USER_ID_1 = 'YOUR_USER_ID';
export const NAME_1 = 'YOUR_USER_NAME';

const baseColor = '#2B3D41';
const bgColor = '#4C5F6B';
const fgColor = '#83A0A0';

function App() {
  let widget = useMultichannelWidget();
  let user = useCurrentUser();

  useEffect(() => {
    if (user == null) {
      widget.setUser({
        userId: USER_ID_1,
        displayName: NAME_1,
        avatarUrl: 'https://via.placeholder.com/200',
        userProperties: {
          rhsName: 'rhsName here',
        },
      });
      widget.setChannelId(CHANNEL_ID);
      widget.setRoomTitle('Room Title');
      widget.setRoomSubTitle(IRoomSubtitleConfig.Editable, 'Room subtitle');

      widget.setNavigationColor(bgColor);
      widget.setNavigationTitleColor(fgColor);
      widget.setBaseColor(baseColor);
      widget.setRightBubbleColor(bgColor);
      widget.setLeftBubbleColor(bgColor);
      widget.setRightBubbleTextColor(fgColor);
      widget.setLeftBubbleTextColor(fgColor);
      widget.setSendContainerBackgroundColor(bgColor);
      widget.setSendContainerColor(fgColor);
      widget.setFieldChatBorderColor(fgColor);

      widget.setAvatar(IAvatarConfig.Disabled);
      // widget.setHideUIEvent();

      widget
        .initiateChat()
        .then(() => console.log('@sukses init'))
        .catch((e: any) => console.log('@error init', e));
    }
  }, [user, widget]);

  return (
    <SafeAreaView style={styles.container}>
      <MultichannelWidget />
    </SafeAreaView>
  );
}

export default function Container() {
  return (
    <MultichannelWidgetProvider appId={APP_ID}>
      <App />
    </MultichannelWidgetProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 0,
  },
});
