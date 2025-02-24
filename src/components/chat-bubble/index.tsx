import format from 'date-fns/format';
import { useAtomValue } from 'jotai/utils';
import React, { PropsWithChildren, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useBubbleBgColor } from '../../hooks/use-bubble-bg-color';
import { useCurrentUser } from '../../hooks/use-current-user';
import IcDoubleTick from '../../icons/double-tick';
import IcTick from '../../icons/tick';
import {
  roomSenderAvatarEnabledAtom,
  timeBackgroundColorThemeAtom,
  timeLabelTextColorThemeAtom,
} from '../../state';
import type { Message } from '../../types';
import { Avatar } from './avatar';

type IProps = PropsWithChildren<{
  message: Message;
  withoutContainer?: boolean;
}>;

export function ChatBubble(props: IProps) {
  const currentUser = useCurrentUser();
  const isSelf = useMemo(
    () => props.message.sender.id === currentUser?.id,
    [currentUser, props.message]
  );
  const withoutContainer = useMemo(
    () => props.withoutContainer ?? false,
    [props.withoutContainer]
  );
  const timeSent = useMemo(
    () => format(new Date(props.message.timestamp), 'hh:mm'),
    [props.message]
  );
  const status = useMemo(() => props.message.status, [props.message]);

  const bubbleBgColor = useBubbleBgColor(props.message.sender?.id);
  const timeFgColor = useAtomValue(timeLabelTextColorThemeAtom);
  const timeBgColor = useAtomValue(timeBackgroundColorThemeAtom);
  const showAvatar = useAtomValue(roomSenderAvatarEnabledAtom);

  const containerSide = useMemo(() => {
    return isSelf ? 'flex-end' : 'flex-start';
  }, [isSelf]);
  const metaContainerSide = useMemo(() => {
    return isSelf ? 'flex-end' : 'flex-start';
  }, [isSelf]);

  return (
    <View
      style={{
        ...styles.container,
        justifyContent: containerSide,
      }}
    >
      {isSelf && (
        <View
          style={{
            ...styles.metaContainer,
            alignItems: metaContainerSide,
            backgroundColor: timeBgColor,
          }}
        >
          <Text
            style={{
              ...styles.metaText,
              color: timeFgColor,
            }}
          >
            {timeSent}
          </Text>
          <Tick status={status as any} senderId={props.message.sender.id} />
        </View>
      )}
      {!withoutContainer && (
        <View
          style={{ ...styles.bubbleContainer, backgroundColor: bubbleBgColor }}
        >
          {props.children}
        </View>
      )}
      {withoutContainer && <>{props.children}</>}
      {!isSelf && (
        <View
          style={{
            ...styles.metaContainer,
            alignItems: metaContainerSide,
            backgroundColor: timeBgColor,
          }}
        >
          <Text style={{ ...styles.metaText, color: timeFgColor }}>
            {timeSent}
          </Text>
        </View>
      )}
      {isSelf && showAvatar && <Avatar />}
    </View>
  );
}

function Tick(props: { status: 'sent' | 'delivered' | 'read', senderId: string }) {
  const readColor = useBubbleBgColor(props.senderId);
  const sentColor = useAtomValue(timeLabelTextColorThemeAtom);

  return props.status === 'read' ? (
    <IcDoubleTick style={styles.tickRead} color={readColor} />
  ) : (
    <IcTick style={styles.tickSent} color={sentColor} />
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  tickSent: { height: 10, width: 10 },
  tickRead: { height: 14, width: 14 },
  bubbleContainer: {
    // backgroundColor: isSelf ? '#27B199' : '#F7F7F7',
    // backgroundColor: bubbleBgColor,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    maxWidth: '60%',
    marginRight: 10,
    flex: 1,
  },
  metaContainer: {
    marginRight: 10,
    alignItems: 'flex-start',
  },
  metaText: {
    fontSize: 11,
    textAlign: 'right',
    color: '#ADADAD',
  },
});
