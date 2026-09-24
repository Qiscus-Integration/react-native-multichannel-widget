import {
  currentUserAtom,
  userConfigAvatarAtom,
  userConfigDisplayNameAtom,
  userConfigIdAtom,
  userConfigPropertiesAtom,
} from '../state';
import type { ISetUserParams } from '../types';
import { resetActiveUser } from '../utils/reset-active-user';
import { useAtomCallbackWithDeps } from './use-atom-callback-with-deps';

export function useSetUser() {
  return useAtomCallbackWithDeps(async (get, set, arg: ISetUserParams) => {
    const currentUser = get(currentUserAtom);
    const resetPromise =
      currentUser != null && currentUser.id !== arg.userId
        ? resetActiveUser(get, set)
        : undefined;

    set(userConfigIdAtom, arg.userId);
    set(userConfigDisplayNameAtom, arg.displayName);
    set(userConfigAvatarAtom, arg.avatarUrl);
    set(userConfigPropertiesAtom, arg.userProperties);

    if (resetPromise != null) await resetPromise;
  }, []);
}
