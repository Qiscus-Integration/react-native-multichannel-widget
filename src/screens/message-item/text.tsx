import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Autolink } from 'react-native-autolink';
import { ChatBubble } from '../../components/chat-bubble/index';
import { useComputedAtomValue } from '../../hooks/use-computed-atom-value';
import { useCurrentUser } from '../../hooks/use-current-user';
import {
  leftBubbleTextColorThemeAtom,
  rightBubbleTextColorThemeAtom,
} from '../../state';
import type { Message } from '../../types';

type MessageItemTextProps = {
  item: Message;
};

export function MessageItemText(props: MessageItemTextProps) {
  const currentUser = useCurrentUser();
  const isSelf = useMemo(() => {
    return currentUser?.id === props.item.sender.id;
  }, [props.item, currentUser]);

  const bubbleFgColor = useComputedAtomValue((get) => {
    return isSelf
      ? get(rightBubbleTextColorThemeAtom)
      : get(leftBubbleTextColorThemeAtom);
  });

  return (
    <ChatBubble message={props.item}>
      <Autolink
        style={{ ...styles.text, color: bubbleFgColor }}
        text={props.item.text}
        url
      />
    </ChatBubble>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
  },
});
