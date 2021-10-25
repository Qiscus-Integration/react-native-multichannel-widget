import AsyncStorage from '@react-native-async-storage/async-storage';
import { RESET, useAtomCallback } from 'jotai/utils';
import {
  channelIdAtom,
  currentUserAtom,
  deviceIdAtom,
  lastUserDataAtom,
  lastUserTokenAtom,
  messagesAtom,
  qiscusAtom,
  roomAtom,
  roomIdAtom,
  STORAGE,
  userConfigAvatarAtom,
  userConfigDisplayNameAtom,
  userConfigIdAtom,
  userConfigPropertiesAtom,
} from '../state';

export function useClearUser() {
  const cb = useAtomCallback(async (get, set) => {
    const room = get(roomAtom);
    set(roomIdAtom, RESET);
    set(currentUserAtom, RESET);
    set(roomAtom, undefined);
    set(messagesAtom, {});
    set(userConfigAvatarAtom, RESET);
    set(userConfigDisplayNameAtom, RESET);
    set(channelIdAtom, RESET);
    set(userConfigIdAtom, RESET);
    set(userConfigPropertiesAtom, RESET);
    set(lastUserDataAtom, RESET);
    set(lastUserTokenAtom, RESET);
    set(deviceIdAtom, RESET);

    get(qiscusAtom).clearUser();
    if (room != null) get(qiscusAtom).unsubscribeChatRoom(room);

    await AsyncStorage.multiRemove([
      STORAGE.lastUserData,
      STORAGE.lastUserToken,
      STORAGE.lastRoomId,
    ]);
  });

  return cb;
}
