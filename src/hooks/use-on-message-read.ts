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
              const item = items[key];
              if (
                item != null &&
                item.id <= message.id &&
                item.status !== 'read'
              ) {
                item.status = 'read';
              }
            }
          });
        }
      });
    },
    [cb]
  );
}
