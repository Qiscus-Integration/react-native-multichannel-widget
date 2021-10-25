import format from 'date-fns/format';
import parse from 'date-fns/parse';
import { useAtomValue } from 'jotai/utils';
import _, { orderBy } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { baseColorThemeAtom, emptyTextColorThemeAtom } from '../state';
import type { Message } from '../types';
import { MessageItemCarousel } from './message-item/carousel';
import { MessageItemImage } from './message-item/image';
import { MessageItemSystemEvent } from './message-item/system-event';
import { MessageItemText } from './message-item/text';

type MessageListProps = {
  messages: Array<Message>;
  onLoadMore: () => void;
};

const reAttachment = /\[\/?file]/gi;
const reExt = /.+\.(\w+)$/i;
export function MessageList(props: MessageListProps) {
  const today = useMemo(() => new Date(), []);
  const messages = useMemo(() => {
    return _(props.messages)
      .reverse()
      .groupBy((item) => format(item.timestamp, 'yyyy MM dd'))
      .map((value, key) => ({
        title: key,
        data: orderBy(value, 'unix_timestamp', 'desc'),
      }))
      .orderBy('title', 'desc')
      .value();
  }, [props.messages]);

  const renderItem = useCallback((item) => {
    if (isImage(item)) {
      return <MessageItemImage item={item} />;
    }
    // if (isVideo(item)) {
    //   return <MessageItemVideo item={item} />;
    // }

    if (item.type === 'carousel') {
      return <MessageItemCarousel item={item} />;
    }

    if (item.type === 'system_event') {
      return <MessageItemSystemEvent item={item} />;
    }

    return <MessageItemText item={item} />;
  }, []);

  const baseBgColor = useAtomValue(baseColorThemeAtom);
  const baseFgColor = useAtomValue(emptyTextColorThemeAtom);

  return (
    <SectionList
      sections={messages}
      keyExtractor={(item, index) => `${index}-${item.uniqueId}`}
      renderItem={({ item }) => renderItem(item)}
      renderSectionFooter={({ section }) => (
        <View
          style={{
            ...styles.container,
            backgroundColor: baseBgColor,
          }}
        >
          <Text style={{ ...styles.date, color: baseFgColor }}>
            {format(parse(section.title, 'yyyy MM dd', today), 'dd MMM yyyy')}
          </Text>
        </View>
      )}
      inverted
      onEndReached={() => props.onLoadMore()}
      onEndReachedThreshold={0.1}
      initialNumToRender={10}
      style={{ ...styles.list, backgroundColor: baseBgColor }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#FFD97C',
    // backgroundColor: baseBgColor,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'center',
  },
  date: {
    textAlign: 'center',
    color: '#232323',
  },
  list: {
    flex: 1,
  },
});

export function isVideo(item: Message) {
  const url = item.text.replace(reAttachment, '').trim();
  const ext = url.match(reExt)?.[1];
  return !!String(ext).match(/mp4|mov|m4v/i);
}

function isImage(item: Message) {
  const url = item.text.replace(reAttachment, '').trim();
  const ext = url.match(reExt)?.[1];
  return !!String(ext).match(/jpe?g|png|gif/i);
}
