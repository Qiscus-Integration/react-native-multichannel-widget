// @ts-nocheck
/* eslint-disable react-native/no-inline-styles */
import { Video } from 'expo-av';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Autolink from 'react-native-autolink';
import { useBubbleBgColor } from '../hooks/use-bubble-bg-color';
import { useBubbleFgColor } from '../hooks/use-bubble-fg-color';
import { ChatBubble } from '../../components/chat-bubble/index';
import type { Message } from '../../types';

type IProps = {
  item: Message;
  onDownload?: () => void;
};
export default function MessageItemVideo({ item }: IProps) {
  const videoRef = useRef<Video>(null);
  const payload = useMemo(() => {
    return item.payload as Record<string, any>;
  }, [item.payload]);
  const [videoHeight, setVideoHeight] = useState(1);

  useEffect(() => {
    videoRef.current?.setOnPlaybackStatusUpdate((status) =>
      console.log('@status', status)
    );
  }, []);

  const bubbleBgColor = useBubbleBgColor(item.sender.id);
  const bubbleFgColor = useBubbleFgColor(item.sender.id);

  return (
    <ChatBubble message={item} withoutContainer>
      <View
        style={{
          ...styles.container,
          backgroundColor: bubbleBgColor,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            videoRef.current?.playAsync();
          }}
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 8,
          }}
        >
          <Video
            ref={videoRef}
            source={{ uri: payload.url }}
            resizeMode="contain"
            useNativeControls
            onError={(error) => console.log('@video::error', error)}
            onReadyForDisplay={(e) => {
              const { height, width } = e.naturalSize;
              const heightScaled = Math.floor((height / width) * 250);
              setVideoHeight(heightScaled);
              console.log('@video::ready', {
                size: e.naturalSize,
                heightScaled,
              });
            }}
            style={{ ...styles.video, height: videoHeight }}
          />
        </TouchableOpacity>
        {payload.caption != null && payload.caption.length > 0 && (
          <Autolink
            url
            text={payload.caption}
            style={{ ...styles.text, color: bubbleFgColor }}
          />
        )}
      </View>
    </ChatBubble>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: 250,
    minHeight: 150,
    borderRadius: 8,
    marginRight: 10,
  },
  video: {
    width: 250,
  },
  text: {
    color: 'white',
    padding: 10,
  },
});
