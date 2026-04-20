import { useMemo } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Autolink } from 'react-native-autolink';
import { ChatBubble } from '../../components/chat-bubble/index';
import { useBubbleFgColor } from '../../hooks/use-bubble-fg-color';
import IcAttachDocument from '../../icons/attach-document';
import type { Message } from '../../types';

type MessageItemFileProps = {
  item: Message;
};

const reAttachment = /\[\/?file]/gi;
const reAttachmentBlock = /\[file](.+?)\[\/file]/i;
const reExt = /\.([a-z0-9]+)$/i;

export function MessageItemFile(props: MessageItemFileProps) {
  const payload: Record<string, unknown> = useMemo(
    () => props.item.payload ?? {},
    [props.item.payload]
  );
  const bubbleFgColor = useBubbleFgColor(props.item.sender.id);

  const url = useMemo(() => {
    const payloadUrl = payload.url;
    if (typeof payloadUrl === 'string' && payloadUrl.length > 0) {
      return payloadUrl;
    }
    const fromAttachment = props.item.text
      .match(reAttachmentBlock)?.[1]
      ?.trim();
    if (fromAttachment && fromAttachment.length > 0) {
      return fromAttachment;
    }
    return props.item.text.replace(reAttachment, '').trim();
  }, [payload.url, props.item.text]);

  const fileName = useMemo(() => {
    const payloadFileName = payload.file_name;
    if (typeof payloadFileName === 'string' && payloadFileName.length > 0) {
      return payloadFileName;
    }

    const basePart = (url.split('?')[0] ?? '').trim();
    const segments = basePart.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1] || 'Attachment';
    try {
      return decodeURIComponent(lastSegment);
    } catch {
      return lastSegment;
    }
  }, [payload.file_name, url]);

  const extension = useMemo(() => {
    const extFromName = fileName.match(reExt)?.[1];
    if (extFromName) return extFromName.toUpperCase();

    const payloadType = payload.type;
    if (typeof payloadType === 'string' && payloadType.includes('/')) {
      const fromMime = payloadType.split('/')[1];
      if (fromMime) return fromMime.toUpperCase();
    }

    return 'FILE';
  }, [fileName, payload.type]);

  const sizeLabel = useMemo(() => {
    const rawSize = payload.size;
    const size = typeof rawSize === 'number' ? rawSize : Number(rawSize);
    if (!Number.isFinite(size) || size <= 0) return null;

    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    if (size < 1024 * 1024 * 1024)
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }, [payload.size]);

  const caption = useMemo(() => {
    return typeof payload.caption === 'string' ? payload.caption : '';
  }, [payload.caption]);

  const domainLabel = useMemo(() => {
    const domain = url.match(/^https?:\/\/([^/]+)/i)?.[1];
    if (!domain) return null;
    return domain.replace(/^www\./i, '');
  }, [url]);

  const onPressFile = async () => {
    if (!url) return;
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    } catch {
      // no-op
    }
  };

  return (
    <ChatBubble message={props.item}>
      <Pressable
        onPress={onPressFile}
        style={({ pressed }) => [
          styles.card,
          pressed ? styles.cardPressed : null,
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${bubbleFgColor}22` },
          ]}
        >
          <IcAttachDocument color={bubbleFgColor} width={18} height={18} />
        </View>
        <View style={styles.metaContainer}>
          <Text
            numberOfLines={1}
            style={[styles.fileNameText, { color: bubbleFgColor }]}
          >
            {fileName}
          </Text>
          <View style={styles.infoRowTop}>
            {domainLabel && (
              <Text
                numberOfLines={1}
                style={[styles.domainText, { color: `${bubbleFgColor}CC` }]}
              >
                {domainLabel}
              </Text>
            )}
            <Text style={[styles.openText, { color: `${bubbleFgColor}CC` }]}>
              Tap to open
            </Text>
          </View>
          <View style={styles.infoRowBottom}>
            <View
              style={[styles.extChip, { borderColor: `${bubbleFgColor}66` }]}
            >
              <Text style={[styles.extText, { color: bubbleFgColor }]}>
                {extension}
              </Text>
            </View>
            {sizeLabel && (
              <Text style={[styles.sizeText, { color: `${bubbleFgColor}CC` }]}>
                {sizeLabel}
              </Text>
            )}
          </View>
        </View>
      </Pressable>
      {caption.length > 0 && (
        <Autolink
          style={[styles.captionText, { color: bubbleFgColor }]}
          text={caption}
          url
        />
      )}
    </ChatBubble>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minWidth: 180,
    maxWidth: 280,
    borderRadius: 8,
  },
  cardPressed: {
    opacity: 0.72,
  },
  iconContainer: {
    height: 34,
    width: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  metaContainer: {
    flex: 1,
  },
  fileNameText: {
    fontSize: 13,
    fontWeight: '600',
  },
  infoRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  infoRowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  domainText: {
    flex: 1,
    fontSize: 11,
    marginRight: 8,
  },
  openText: {
    fontSize: 10,
    fontWeight: '600',
  },
  extChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 1,
    marginRight: 8,
  },
  extText: {
    fontSize: 10,
    fontWeight: '700',
  },
  sizeText: {
    fontSize: 11,
  },
  captionText: {
    fontSize: 13,
    marginTop: 10,
  },
});
