import { messagesAtom, qiscusAtom } from '../state';
import type { Message } from '../types';
import { useAtomCallbackSubscription } from './use-atom-callback-subscription';

export function useOnMessageDelivered(cb?: (message: Message) => void): void {
  useAtomCallbackSubscription(
    (get, set, isMounted) => {
      return get(qiscusAtom).onMessageDelivered((comment) => {
        if (isMounted()) {
          cb?.(comment);
          set(messagesAtom, (items) => {
            for (const key in items) {
              const item = items[key];
              if (
                item != null &&
                item.id <= comment.id &&
                item.status !== 'delivered' &&
                item.status !== 'read'
              ) {
                item.status = 'delivered';
              }
            }
          });
        }
      });
    },
    [cb]
  );
}
