/* eslint-disable react-native/no-inline-styles */
import { PortalHost } from '@gorhom/portal';
import { useAtomValue } from 'jotai/utils';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { DocumentPickerResponse } from 'react-native-document-picker';
import { AttachmentMenu } from '../components/attachment-menu';
import { Header } from '../components/header/index';
import { useCurrentChatRoom } from '../hooks/use-current-chatroom';
import { useQiscus } from '../hooks/use-qiscus';
import {
  baseColorThemeAtom,
  roomSubtitleTextAtom,
  roomTitleAtom,
} from '../state';
import { MessageForm } from './message-form';
import { MessageList } from './message-list';

type MultichannelWidgetProps = {
  onBack: () => void;
};

export function MultichannelWidget(props: MultichannelWidgetProps) {
  const qiscus = useQiscus();
  const { room, messages, sendMessage, loadMoreMessages } =
    useCurrentChatRoom();

  const lastMessageId = useMemo(() => messages[0]?.id, [messages]);
  const onSendMessage = useCallback(
    async (text: string) => {
      if (room != null) {
        let message = qiscus.generateMessage({
          roomId: room.id,
          text,
        });
        await sendMessage(message);
      }
    },
    [qiscus, room, sendMessage]
  );
  const onLoadMore = useCallback(async () => {
    await loadMoreMessages(lastMessageId);
  }, [lastMessageId, loadMoreMessages]);

  const appTitle = useAtomValue(roomTitleAtom);
  const appSubtitleText = useAtomValue(roomSubtitleTextAtom);

  const isEmpty = useMemo(() => messages.length === 0, [messages]);

  const [attachmentMenuVisible, setAttachmentMenuVisible] = useState(false);

  const onImageSelected = useCallback(
    async (v: DocumentPickerResponse) => {
      qiscus.upload(v as any, (error, progress, url) => {
        if (error != null) {
          console.log(error);
        }
        if (progress != null) {
          console.log('progress', progress);
        }
        if (url != null) {
          // Sukses upload
          const message = qiscus.generateFileAttachmentMessage({
            roomId: room!.id,
            url: url,
            caption: '',
            text: '',
          });

          sendMessage(message);
        }
      });
    },
    [qiscus, room, sendMessage]
  );
  const onDocumentSelected = useCallback(
    async (v: DocumentPickerResponse) => {
      qiscus.upload(v as any, (error, progress, url) => {
        if (error != null) {
          console.log(error);
        }
        if (progress != null) {
          // Update progress
          console.log('progress', progress);
        }
        if (url != null) {
          // Sukses upload
          const message = qiscus.generateFileAttachmentMessage({
            roomId: room!.id,
            url: url,
            caption: '',
            text: '',
          });

          sendMessage(message);
        }
      });
    },
    [qiscus, room, sendMessage]
  );

  return (
    <View style={{ flex: 1, position: 'relative', marginTop: 0 }}>
      <View style={styles.container}>
        <Header
          title={appTitle}
          subtitle={appSubtitleText}
          onBack={props.onBack}
        />
        {isEmpty && <EmptyChat />}
        {!isEmpty && (
          <MessageList messages={messages ?? []} onLoadMore={onLoadMore} />
        )}
        <MessageForm
          onTapAddAttachment={() => setAttachmentMenuVisible(true)}
          onSendMessage={onSendMessage}
        />
        {attachmentMenuVisible && (
          <AttachmentMenu
            onClose={() => setAttachmentMenuVisible(false)}
            onImageSelected={onImageSelected}
            onDocumentSelected={onDocumentSelected}
          />
        )}
      </View>
      <PortalHost name="attachment-menu" />
    </View>
  );
}

function EmptyChat() {
  const baseBgColor = useAtomValue(baseColorThemeAtom);
  return (
    <View style={{ ...styles.emptyContainer, backgroundColor: baseBgColor }}>
      <Text style={styles.emptyText1}>No message here yet...</Text>
      <Text style={styles.emptyText2}>
        Great discussion start from greeting each others first
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    backgroundColor: 'black',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText1: { fontSize: 22, color: '#999', fontWeight: 'bold' },
  emptyText2: { color: '#999', width: '65%', textAlign: 'center' },
});
