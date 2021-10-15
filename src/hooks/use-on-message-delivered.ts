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
              if (
                items[key].id <= comment.id &&
                items[key].status !== 'delivered' &&
                items[key].status !== 'read'
              ) {
                items[key].status = 'delivered';
              }
            }
          });
        }
      });
    },
    [cb]
  );
}
