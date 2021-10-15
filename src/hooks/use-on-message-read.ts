import { messagesAtom, qiscusAtom } from '../state';
import type { Message } from '../types';
import { useAtomCallbackSubscription } from './use-atom-callback-subscription';

export function useOnMessageRead(cb?: (message: Message) => void): void {
  useAtomCallbackSubscription(
    (get, set, isMounted: () => boolean) => {
      return get(qiscusAtom).onMessageRead((message) => {
        if (isMounted()) {
          cb?.(message);
          set(messagesAtom, (items) => {
            for (const key in items) {
              if (items[key].id <= message.id && items[key].status !== 'read') {
                items[key].status = 'read';
              }
            }
          });
        }
      });
    },
    [cb]
  );
}
