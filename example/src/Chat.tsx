import {
  IAvatarConfig,
  MultichannelWidget,
  useCurrentUser,
  useMultichannelWidget,
} from '@qiscus-community/react-native-multichannel-widget';
import { useEffect } from 'react';

export const baseColor = '#2B3D41';
export const bgColor = '#4C5F6B';
export const fgColor = '#83A0A0';

export function Chat() {
  let widget = useMultichannelWidget();
  let user = useCurrentUser();

  useEffect(() => {
      widget.setRoomTitle('Room Title');
      // widget.setRoomSubTitle(IRoomSubtitleConfig.Editable, 'Room subtitle');
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
      widget.setFieldChatIconColor(fgColor);
      widget.setFieldChatTextColor(fgColor);
      widget.setAvatar(IAvatarConfig.Disabled);
      // widget.setHideUIEvent();
  }, [user, widget]);

  return <MultichannelWidget onBack={() => widget.clearUser()} />;
}
