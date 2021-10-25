import React, { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Autolink } from 'react-native-autolink';
import { useBubbleBgColor } from '../../hooks/use-bubble-bg-color';
import { useBubbleFgColor } from '../../hooks/use-bubble-fg-color';
import { ChatBubble } from '../../components/chat-bubble/index';
import type { Message } from '../../types';

type MessageItemImageProps = {
  item: Message;
  onTap?: () => void;
};
export function MessageItemImage(props: MessageItemImageProps) {
  const payload: Record<string, unknown> = useMemo(
    () => props.item.payload!,
    [props.item]
  );

  const bubbleBgColor = useBubbleBgColor(props.item.sender.id);
  const bubbleFgColor = useBubbleFgColor(props.item.sender.id);

  const url = useMemo(
    () =>
      (payload.url as string | undefined)?.replace(
        '/upload/',
        '/upload/w_320,h_320,c_limit/'
      ),
    [payload.url]
  );

  return (
    <ChatBubble message={props.item} withoutContainer>
      <View style={{ ...styles.container, backgroundColor: bubbleBgColor }}>
        <Image
          source={{ uri: url }}
          onError={() => console.log('error loading image', payload?.url)}
          style={styles.image}
        />
        {payload.caption != null && (payload.caption as string).length > 0 && (
          <Autolink
            url
            text={payload.caption as string}
            style={{ ...styles.text, color: bubbleFgColor }}
          />
        )}
      </View>
    </ChatBubble>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 160,
    width: 250,
    borderRadius: 8,
    marginRight: 10,
  },
  image: {
    flex: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  text: {
    color: 'white',
    padding: 10,
  },
});
