import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useCurrentUserAvatar } from '../../hooks/use-current-user-avatar';

export function Avatar() {
  const avatarUrl = useCurrentUserAvatar();

  return (
    <View style={styles.container}>
      <Image style={styles.avatar} source={avatarUrl} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#27B199',
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 100,
  },
});
