import { MutableRefObject, useRef } from 'react';
import { qiscusAtom, roomIdAtom, typingStatusAtom } from '../state';
import { useAtomCallbackSubscription } from './use-atom-callback-subscription';

export function useOnUserTyping(
  cb?: (roomId: number, userId: string, isTyping: boolean) => void
) {
  let typingId: MutableRefObject<any> = useRef();
  useAtomCallbackSubscription(
    (get, set, isMounted) => {
      return get(qiscusAtom).onUserTyping((userId, roomId, isTyping) => {
        if (isMounted()) {
          cb?.(roomId, userId, isTyping);
          const _roomId = get(roomIdAtom);

          if (typingId.current != null) clearTimeout(typingId.current);
          typingId.current = setTimeout(() => {
            set(typingStatusAtom, false);
          }, 5000);

          if (_roomId === roomId) {
            set(typingStatusAtom, isTyping);
          }
        }
      });
    },
    [cb]
  );
}
