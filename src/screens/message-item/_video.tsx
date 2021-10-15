// @ts-nocheck
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Autolink from 'react-native-autolink';
import { Video } from 'expo-av';
import { ChatBubble } from '../../components/chat-bubble/index';
import type { Message } from '../../types';
import { useCurrentUser } from '../../hooks/use-current-user';
import { useComputedAtomValue } from '../../hooks/use-computed-atom-value';
import {
  leftBubbleColorThemeAtom,
  leftBubbleTextColorThemeAtom,
  rightBubbleColorThemeAtom,
  rightBubbleTextColorThemeAtom,
} from '../../state';

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

  const currentUser = useCurrentUser();
  const isSelf = useMemo(
    () => item.sender.id === currentUser?.id,
    [currentUser?.id, item?.sender]
  );

  const bubbleBgColor = useComputedAtomValue((get) => {
    return isSelf
      ? get(rightBubbleColorThemeAtom)
      : get(leftBubbleColorThemeAtom);
  });

  const bubbleFgColor = useComputedAtomValue((get) => {
    return isSelf
      ? get(rightBubbleTextColorThemeAtom)
      : get(leftBubbleTextColorThemeAtom);
  });

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
