import { messagesAtom, qiscusAtom } from '../state';
import type { Message } from '../types';
import { useAtomCallbackSubscription } from './use-atom-callback-subscription';

export function useOnMessageDeleted(cb?: (message: Message) => void): void {
  useAtomCallbackSubscription(
    (get, set, isMounted) => {
      return get(qiscusAtom).onMessageDeleted((message) => {
        if (isMounted()) {
          cb?.(message);

          set(messagesAtom, (items) => {
            if (Object.hasOwn(items, message.uniqueId)) {
              delete items[message.uniqueId];
            }
          });
        }
      });
    },
    [cb]
  );
}
