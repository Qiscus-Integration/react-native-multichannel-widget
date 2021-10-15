import { messagesAtom, qiscusAtom } from '../state';
import type { Message } from '../types';
import { useAtomCallbackSubscription } from './use-atom-callback-subscription';

export function useOnMessageReceived(cb?: (message: Message) => void): void {
  useAtomCallbackSubscription(
    (get, set, isMounted) => {
      return get(qiscusAtom).onMessageReceived((message) => {
        if (isMounted()) {
          cb?.(message);
          set(messagesAtom, (items) => {
            items[message.uniqueId] = message;
          });
        }
      });
    },
    [cb]
  );
}
