/* eslint-disable react-native/no-inline-styles */
import { PortalHost } from '@gorhom/portal';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { useCallback, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import type { PickedFile } from '../types/file-picker';
import { AttachmentMenu } from '../components/attachment-menu';
import { Header } from '../components/header/index';
import { useCurrentChatRoom } from '../hooks/use-current-chatroom';
import { useQiscus } from '../hooks/use-qiscus';
import {
  baseColorThemeAtom,
  currentUserAtom,
  messagesAtom,
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
  const currentUser = useAtomValue(currentUserAtom);
  const setMessages = useUpdateAtom(messagesAtom);
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
        await sendMessage(message).catch(() => {
          Alert.alert('Gagal', 'Pesan gagal dikirim');
        });
      }
    },
    [qiscus, room, sendMessage]
  );
  const onLoadMore = useCallback(async () => {
    if (lastMessageId != null) {
      await loadMoreMessages(lastMessageId);
    }
  }, [lastMessageId, loadMoreMessages]);

  const appTitle = useAtomValue(roomTitleAtom);
  const appSubtitleText = useAtomValue(roomSubtitleTextAtom);

  const isEmpty = useMemo(() => messages.length === 0, [messages]);

  const [attachmentMenuVisible, setAttachmentMenuVisible] = useState(false);
  const getUploadConfig = useCallback(() => {
    const storage = (qiscus as any)?.storage;
    return {
      uploadUrl: storage?.getUploadUrl?.() ?? null,
      token: storage?.getToken?.() ?? null,
      appId: storage?.getAppId?.() ?? null,
      sdkVersion: storage?.getVersion?.() ?? null,
    };
  }, [qiscus]);
  const uploadViaSdk = useCallback(
    (file: { uri: string; type: string; name: string }) =>
      new Promise<string>((resolve, reject) => {
        qiscus.upload(file as any, (error, _progress, url) => {
          if (error != null) {
            reject(error);
            return;
          }
          if (url != null) {
            resolve(url);
          }
        });
      }),
    [qiscus]
  );
  const uploadViaFetchFallback = useCallback(
    async (file: {
      uri: string;
      type: string;
      name: string;
    }): Promise<string> => {
      const { uploadUrl, token, appId, sdkVersion } = getUploadConfig();
      if (!uploadUrl || !token || !appId) {
        throw new Error('fallback upload invalid config');
      }

      const sendFallbackRequest = async (mode: 'uri' | 'blob') => {
        const formData = new FormData();
        const fd = formData as any;
        if (mode === 'blob') {
          const localFileResponse = await fetch(file.uri);
          const blob = await localFileResponse.blob();
          fd.append('file', blob, file.name);
        } else {
          fd.append('file', file);
        }
        fd.append('token', token);
        fd.append('app_id', appId);

        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'qiscus-sdk-app-id': String(appId),
            'qiscus-sdk-version': String(sdkVersion ?? ''),
          },
          body: formData,
        });
        const raw = await response.text();

        let json: any = null;
        try {
          json = raw ? JSON.parse(raw) : null;
        } catch {}

        return { mode, response, raw, json };
      };

      const first = await sendFallbackRequest('uri');
      if (first.response.ok) {
        const uploadedUrl = first.json?.results?.file?.url;
        if (uploadedUrl) return uploadedUrl;
      }

      const shouldRetryWithBlob =
        first.response.status === 400 &&
        String(first.json?.error?.message ?? '').toLowerCase() ===
          'validation error';

      if (shouldRetryWithBlob) {
        const second = await sendFallbackRequest('blob');
        if (second.response.ok) {
          const secondUrl = second.json?.results?.file?.url;
          if (secondUrl) return secondUrl;
        }
        throw new Error(
          `Fallback upload failed with HTTP ${second.response.status}`
        );
      }

      throw new Error(
        `Fallback upload failed with HTTP ${first.response.status}`
      );
    },
    [getUploadConfig]
  );
  const uploadAttachment = useCallback(
    async (file: { uri: string; type: string; name: string }) => {
      try {
        return await uploadViaSdk(file);
      } catch (error: any) {
        const isNetworkError =
          error?.code === 'ERR_NETWORK' ||
          String(error?.message || '')
            .toLowerCase()
            .includes('network error');
        if (!isNetworkError) throw error;

        return uploadViaFetchFallback(file);
      }
    },
    [uploadViaFetchFallback, uploadViaSdk]
  );

  const onImageSelected = useCallback(
    async (v: PickedFile) => {
      const fileUri = v.uri;
      const file = {
        uri: fileUri,
        type: v.type || 'image/jpeg',
        name: v.name || 'image.jpg',
      };

      const placeholderId = `upload-${Date.now()}`;
      setMessages((prev: Record<string, any>) => {
        prev[placeholderId] = {
          id: Date.now(),
          uniqueId: placeholderId,
          type: 'loading_placeholder',
          text: `Uploading ${file.name}...`,
          status: 'sending',
          timestamp: new Date(),
          chatRoomId: room?.id,
          sender: currentUser,
        } as any;
      });

      try {
        const url = await uploadAttachment(file);

        if (!room) {
          setMessages((prev: Record<string, any>) => {
            delete prev[placeholderId];
          });
          return;
        }

        const message = qiscus.generateFileAttachmentMessage({
          roomId: room.id,
          url: url,
          caption: '',
          text: '',
        });

        setMessages((prev: Record<string, any>) => {
          delete prev[placeholderId];
        });
        sendMessage(message).catch(() => {
          Alert.alert('Gagal', 'Pesan gagal dikirim');
        });
      } catch {
        setMessages((prev: Record<string, any>) => {
          delete prev[placeholderId];
        });
        Alert.alert(
          'Gagal',
          'Terjadi kesalahan saat mengunggah lampiran gambar.'
        );
      }
    },
    [qiscus, room, sendMessage, uploadAttachment, setMessages, currentUser]
  );
  const onDocumentSelected = useCallback(
    async (v: PickedFile) => {
      const fileUri = v.uri;
      const file = {
        uri: fileUri,
        type: v.type || 'application/octet-stream',
        name: v.name || 'document',
      };

      const placeholderId = `upload-${Date.now()}`;
      setMessages((prev: Record<string, any>) => {
        prev[placeholderId] = {
          id: Date.now(),
          uniqueId: placeholderId,
          type: 'loading_placeholder',
          text: `Uploading ${file.name}...`,
          status: 'sending',
          timestamp: new Date(),
          chatRoomId: room?.id,
          sender: currentUser,
        } as any;
      });

      try {
        const url = await uploadAttachment(file);

        if (!room) {
          setMessages((prev: Record<string, any>) => {
            delete prev[placeholderId];
          });
          return;
        }

        const message = qiscus.generateFileAttachmentMessage({
          roomId: room.id,
          url: url,
          caption: '',
          text: '',
        });

        setMessages((prev: Record<string, any>) => {
          delete prev[placeholderId];
        });
        sendMessage(message).catch(() => {
          Alert.alert('Gagal', 'Pesan gagal dikirim');
        });
      } catch {
        setMessages((prev: Record<string, any>) => {
          delete prev[placeholderId];
        });
        Alert.alert(
          'Gagal',
          'Terjadi kesalahan saat mengunggah lampiran dokumen.'
        );
      }
    },
    [qiscus, room, sendMessage, uploadAttachment, setMessages, currentUser]
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
