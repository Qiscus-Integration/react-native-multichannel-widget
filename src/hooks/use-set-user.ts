import {
  userConfigAvatarAtom,
  userConfigDisplayNameAtom,
  userConfigIdAtom,
  userConfigPropertiesAtom,
} from '../state';
import type { ISetUserParams } from '../types';
import { useAtomCallbackWithDeps } from './use-atom-callback-with-deps';

export function useSetUser() {
  return useAtomCallbackWithDeps((_, set, arg: ISetUserParams) => {
    set(userConfigIdAtom, arg.userId);
    set(userConfigDisplayNameAtom, arg.displayName);
    set(userConfigAvatarAtom, arg.avatarUrl);
    set(userConfigPropertiesAtom, arg.userProperties);
  }, []);
}
