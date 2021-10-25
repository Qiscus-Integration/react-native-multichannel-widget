import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAtomCallback } from 'jotai/utils';
import { useCallback } from 'react';
import {
  appIdAtom,
  currentUserAtom,
  lastUserTokenAtom,
  optionsAtom,
  qiscusAtom,
  roomIdAtom,
  STORAGE,
} from '../state';
import type { Account, SetupOptions } from '../types';
import { useOnMessageDelivered } from './use-on-message-delivered';
import { useOnMessageRead } from './use-on-message-read';
import { useOnMessageReceived } from './use-on-message-received';
import { useOnUserTyping } from './use-on-user-typing';
import { useSetUser } from './use-set-user';

export function useSetup(): (
  appId: string,
  options?: SetupOptions
) => Promise<void> {
  useOnUserTyping();
  useOnMessageReceived();
  useOnMessageRead();
  useOnMessageDelivered();
  const setUser = useSetUser();

  let cb = useAtomCallback(
    async (get, set, arg: { appId: string; options?: SetupOptions }) => {
      let { appId, options } = arg;
      const qiscus = get(qiscusAtom);

      const lastAppId = await AsyncStorage.getItem(STORAGE.lastAppId);
      const lastUserData: Account | undefined = await AsyncStorage.getItem(
        STORAGE.lastUserData
      ).then((it) => (it != null ? JSON.parse(it) : undefined));
      const lastUserToken = await AsyncStorage.getItem(STORAGE.lastUserToken);
      const lastRoomId = await AsyncStorage.getItem(STORAGE.lastRoomId);

      if (lastUserData != null && lastUserToken != null) {
        set(appIdAtom, lastAppId!);
        setUser({
          userId: lastUserData.id,
          displayName: lastUserData.name,
          avatarUrl: lastUserData.avatarUrl,
          userProperties: lastUserData.extras,
        });
        set(lastUserTokenAtom, lastUserToken);
        set(currentUserAtom, lastUserData);

        // Internal code should not be used unless you know what you are doing
        // @ts-ignore
        qiscus.storage.setAppId(lastAppId!);
        // @ts-ignore
        qiscus.storage.setCurrentUser(lastUserData);
        // @ts-ignore
        qiscus.storage.setToken(lastUserToken);
      }
      if (lastRoomId != null) set(roomIdAtom, parseInt(lastRoomId, 10));

      set(optionsAtom, (opts) => {
        return { ...opts, ...options };
      });

      await qiscus.setup(appId);
      // get(qiscusAtom).enableDebugMode(true);
    }
  );

  const runner = useCallback(
    (appId: string, options?: SetupOptions) => cb({ appId, options }),
    [cb]
  );
  return runner;
}
