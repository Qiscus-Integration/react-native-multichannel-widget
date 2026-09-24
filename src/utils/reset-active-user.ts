import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Getter, Setter } from 'jotai';
import { RESET } from 'jotai/utils';
import {
  currentUserAtom,
  lastUserDataAtom,
  lastUserTokenAtom,
  messagesAtom,
  qiscusAtom,
  roomAtom,
  roomIdAtom,
  secureSessionAtom,
  STORAGE,
} from '../state';
import type { QiscusSDK } from '../types';

type QiscusUserClient = Pick<QiscusSDK, 'clearUser' | 'unsubscribeChatRoom'>;

export async function resetActiveUser(
  get: Getter,
  set: Setter,
  qiscus: QiscusUserClient = get(qiscusAtom)
) {
  const room = get(roomAtom);

  set(roomIdAtom, RESET);
  set(currentUserAtom, RESET);
  set(roomAtom, undefined);
  set(messagesAtom, {});
  set(lastUserDataAtom, RESET);
  set(lastUserTokenAtom, RESET);
  set(secureSessionAtom, RESET);

  qiscus.clearUser();
  if (room != null) qiscus.unsubscribeChatRoom(room);

  await AsyncStorage.multiRemove([
    STORAGE.lastUserData,
    STORAGE.lastUserToken,
    STORAGE.lastRoomId,
    STORAGE.lastSessionId,
  ]);
}
