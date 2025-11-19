import { useMemo, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { Autolink } from 'react-native-autolink';
import { ChatBubble } from '../../components/chat-bubble/index';
import { useBubbleBgColor } from '../../hooks/use-bubble-bg-color';
import { useBubbleFgColor } from '../../hooks/use-bubble-fg-color';
import type { Message } from '../../types';

type MessageItemImageProps = {
  item: Message;
  onTap?: () => void;
};
export function MessageItemImage(props: MessageItemImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
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
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: url }}
            onLoadStart={() => {
              setLoading(true);
              setError(false);
            }}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            style={styles.image}
            resizeMode="cover"
          />
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
          {error && (
            <View style={styles.errorOverlay}>
              <Text style={styles.errorText}>Failed to load</Text>
            </View>
          )}
        </View>
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
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    flex: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  errorText: {
    color: 'white',
    fontSize: 12,
  },
  text: {
    color: 'white',
    padding: 10,
  },
});
