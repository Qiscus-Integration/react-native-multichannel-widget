import {
  attachmentAtom,
  avatarAtom,
  loginMessageAtom,
  messageExtrasAtom,
  progressUploadingAtom,
  qiscusAtom,
  replayMessageAtom,
  roomIdAtom,
  subtitleAtom,
  titleAtom,
  typingStatusAtom,
  unreadCountAtom,
} from '../state';
import { RESET, useAtomCallback } from 'jotai/utils';

export function useEndSession(): () => Promise<void> {
  return useAtomCallback((get, set) => {
    get(qiscusAtom).clearUser();
    set(titleAtom, RESET);
    set(subtitleAtom, RESET);
    set(avatarAtom, RESET);
    set(progressUploadingAtom, RESET);
    set(attachmentAtom, RESET);
    set(typingStatusAtom, RESET);
    set(unreadCountAtom, RESET);
    set(roomIdAtom, RESET);
    set(loginMessageAtom, RESET);
    set(replayMessageAtom, RESET);
    set(messageExtrasAtom, RESET);
  });
}
