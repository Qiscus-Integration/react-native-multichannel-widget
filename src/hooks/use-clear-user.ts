import { RESET, useAtomCallback } from 'jotai/utils';
import {
  channelIdAtom,
  deviceIdAtom,
  userConfigAvatarAtom,
  userConfigDisplayNameAtom,
  userConfigIdAtom,
  userConfigPropertiesAtom,
} from '../state';
import { resetActiveUser } from '../utils/reset-active-user';

export function useClearUser() {
  const cb = useAtomCallback(async (get, set) => {
    const resetPromise = resetActiveUser(get, set);
    set(userConfigAvatarAtom, RESET);
    set(userConfigDisplayNameAtom, RESET);
    set(channelIdAtom, RESET);
    set(userConfigIdAtom, RESET);
    set(userConfigPropertiesAtom, RESET);
    set(deviceIdAtom, RESET);
    await resetPromise;
  });

  return cb;
}
