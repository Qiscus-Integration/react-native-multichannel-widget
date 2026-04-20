import {
  IAvatarConfig,
  MultichannelWidget,
  useMultichannelWidget,
} from '@qiscus-community/react-native-multichannel-widget';
import { useEffect } from 'react';

export const baseColor = '#2B3D41';
export const bgColor = '#4C5F6B';
export const fgColor = '#83A0A0';
export const inputTextColor = '#163239';

export function Chat() {
  const widget = useMultichannelWidget();

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
    widget.setFieldChatTextColor(inputTextColor);
    widget.setAvatar(IAvatarConfig.Disabled);
    // widget.setHideUIEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Attachment picker is handled internally by the library via
  // @react-native-documents/picker (minimum supported: >=10.1.7).
  return <MultichannelWidget onBack={() => widget.clearUser()} />;
}
