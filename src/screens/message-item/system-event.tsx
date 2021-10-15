import { useAtomValue } from 'jotai/utils';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  roomSystemEventHiddenAtom,
  timeLabelTextColorThemeAtom,
} from '../../state';
import type { Message } from '../../types';

type MessageItemSystemEventProps = {
  item: Message;
};

export function MessageItemSystemEvent(props: MessageItemSystemEventProps) {
  const baseFgColor = useAtomValue(timeLabelTextColorThemeAtom);
  const isHidden = useAtomValue(roomSystemEventHiddenAtom);

  if (isHidden) {
    return null;
  }

  return (
    <View style={[styles.container, { borderColor: baseFgColor }]}>
      <Text style={[styles.text, { color: baseFgColor }]}>
        {props.item.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#01416C',
    maxWidth: '75%',
    alignSelf: 'center',
    marginVertical: 5,
  },
  text: {
    color: '#01416C',
    textAlign: 'center',
  },
});
