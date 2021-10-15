import { useAtomValue } from 'jotai/utils';
import * as React from 'react';
import { useMemo } from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useComputedAtomValue } from '../../hooks/use-computed-atom-value';
import {
  currentUserAtom,
  navigationColorThemeAtom,
  navigationTitleColorThemeAtom,
  roomSubtitleConfigAtom,
  roomSubtitleTextAtom,
  roomTitleAtom,
  subtitleAtom,
  titleAtom,
  typingStatusAtom,
} from '../../state';
import { IRoomSubtitleConfig } from '../../types';

type IProps = {
  height?: number;
  title?: string;
  subtitle?: string;
};

export function Header({ height, title, subtitle }: IProps) {
  const navigationBgColor = useAtomValue(navigationColorThemeAtom);
  const containerStyle: StyleProp<ViewStyle> = useMemo(() => {
    const style = { ...styles.container, backgroundColor: navigationBgColor };
    if (height != null) style.height = height;
    return style;
  }, [navigationBgColor, height]);

  return (
    <View style={containerStyle}>
      <TouchableOpacity style={styles.backBtn}>
        <Image source={require('../../assets/arrow-left.png')} />
        <Avatar />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Content title={title} subtitle={subtitle} />
      </View>
    </View>
  );
}

function Avatar() {
  const isLoggedIn = useComputedAtomValue(
    (get) => get(currentUserAtom) != null
  );

  return (
    <View style={styles.avatarContainer}>
      {!isLoggedIn && (
        <Image
          style={styles.avatar}
          source={require('../../assets/chat_connecting.png')}
        />
      )}
      {isLoggedIn && (
        <Image
          style={styles.avatar}
          source={require('../../assets/defaultAvatar.png')}
        />
      )}
    </View>
  );
}

function Content(props: { title?: string; subtitle?: string }) {
  const navigationFgColor = useAtomValue(navigationTitleColorThemeAtom);

  const isConnecting = useComputedAtomValue(
    (get) => get(currentUserAtom) == null
  );
  const title = useTitle(props.title);
  const subtitle = useSubtitle(props.subtitle);

  return (
    <View style={styles.content}>
      <Text style={{ ...styles.title, color: navigationFgColor }}>{title}</Text>
      {!isConnecting && (
        <Text style={{ ...styles.subtitle, color: navigationFgColor }}>
          {subtitle}
        </Text>
      )}
      {isConnecting && (
        <Text style={{ ...styles.subtitle, color: navigationFgColor }}>
          Connecting...
        </Text>
      )}
    </View>
  );
}

function useTitle(title?: string) {
  return useComputedAtomValue((get) => {
    const roomTitle = get(roomTitleAtom);
    if (roomTitle != null) return roomTitle;
    if (title != null) return title;
    return get(titleAtom);
  });
}
function useSubtitle(subtitle?: string) {
  return useComputedAtomValue((get) => {
    const roomSubtitleConfig = get(roomSubtitleConfigAtom);
    const roomSubtitleText = get(roomSubtitleTextAtom);
    const isTyping = get(typingStatusAtom);

    if (roomSubtitleConfig === IRoomSubtitleConfig.Disabled) return null;
    if (
      (roomSubtitleConfig === IRoomSubtitleConfig.Enabled ||
        roomSubtitleConfig === IRoomSubtitleConfig.Editable) &&
      isTyping
    )
      return 'Typing...';
    if (roomSubtitleConfig === IRoomSubtitleConfig.Enabled)
      return get(subtitleAtom);
    if (
      roomSubtitleConfig === IRoomSubtitleConfig.Editable &&
      roomSubtitleText != null
    )
      return roomSubtitleText;
    if (subtitle != null) return subtitle;
    return get(subtitleAtom);
  });
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  backBtn: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  avatarContainer: {
    marginLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
    marginRight: 12,
  },
  contentContainer: { flex: 1 },
  content: {
    marginTop: 0,
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
