import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ChatBubble } from '../../components/chat-bubble/index';
import { useComputedAtomValue } from '../../hooks/use-computed-atom-value';
import { useCurrentUser } from '../../hooks/use-current-user';
import { rightBubbleTextColorThemeAtom } from '../../state';
import type { Message } from '../../types';

type MessageItemLoadingProps = {
  item: Message;
};

export function MessageItemLoading(props: MessageItemLoadingProps) {
  const currentUser = useCurrentUser();
  const isSelf = useMemo(() => {
    return currentUser?.id === props.item.sender.id;
  }, [props.item, currentUser]);

  const bubbleFgColor = useComputedAtomValue((get) => {
    return isSelf ? get(rightBubbleTextColorThemeAtom) : '#666';
  });

  return (
    <View style={styles.wrapper}>
      <ChatBubble message={props.item}>
        <View style={styles.content}>
          <ActivityIndicator
            size="small"
            color={bubbleFgColor as string}
            style={styles.loader}
          />
          <Text
            style={[styles.text, { color: bubbleFgColor as string }]}
            numberOfLines={1}
          >
            {props.item.text}
          </Text>
        </View>
      </ChatBubble>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    opacity: 0.8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 200,
    opacity: 0.7,
  },
  loader: {
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    flexShrink: 1,
  },
});
