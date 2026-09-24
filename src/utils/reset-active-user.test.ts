import AsyncStorage from '@react-native-async-storage/async-storage';
import { RESET } from 'jotai/utils';
import {
  currentUserAtom,
  lastUserDataAtom,
  lastUserTokenAtom,
  messagesAtom,
  roomAtom,
  roomIdAtom,
  secureSessionAtom,
  STORAGE,
} from '../state';
import { resetActiveUser } from './reset-active-user';

jest.mock('../state', () => ({
  currentUserAtom: 'currentUserAtom',
  lastUserDataAtom: 'lastUserDataAtom',
  lastUserTokenAtom: 'lastUserTokenAtom',
  messagesAtom: 'messagesAtom',
  roomAtom: 'roomAtom',
  roomIdAtom: 'roomIdAtom',
  secureSessionAtom: 'secureSessionAtom',
  STORAGE: {
    lastUserData: 'lastUserData',
    lastUserToken: 'lastUserToken',
    lastRoomId: 'lastRoomId',
    lastSessionId: 'lastSessionId',
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  multiRemove: jest.fn().mockResolvedValue(undefined),
}));

describe('resetActiveUser', () => {
  it('clears the active room, identity, session, and persisted user data', async () => {
    const room = { id: 123 } as any;
    const qiscus = {
      clearUser: jest.fn(),
      unsubscribeChatRoom: jest.fn(),
    };
    const get = jest.fn((atom: unknown) =>
      atom === roomAtom ? room : undefined
    );
    const set = jest.fn();

    await resetActiveUser(get, set, qiscus);

    expect(qiscus.clearUser).toHaveBeenCalledTimes(1);
    expect(qiscus.unsubscribeChatRoom).toHaveBeenCalledWith(room);
    expect(set).toHaveBeenCalledWith(currentUserAtom, RESET);
    expect(set).toHaveBeenCalledWith(roomAtom, undefined);
    expect(set).toHaveBeenCalledWith(roomIdAtom, RESET);
    expect(set).toHaveBeenCalledWith(lastUserDataAtom, RESET);
    expect(set).toHaveBeenCalledWith(lastUserTokenAtom, RESET);
    expect(set).toHaveBeenCalledWith(secureSessionAtom, RESET);
    expect(set).toHaveBeenCalledWith(messagesAtom, {});
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
      STORAGE.lastUserData,
      STORAGE.lastUserToken,
      STORAGE.lastRoomId,
      STORAGE.lastSessionId,
    ]);
  });
});
