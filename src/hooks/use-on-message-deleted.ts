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
            const newItems = {} as Record<string, Message>;
            for (let key in items) {
              if (items[key].uniqueId !== message.uniqueId) {
                newItems[key] = items[key];
              } else {
                cb?.(items[key]);
              }
            }
          });
        }
      });
    },
    [cb]
  );
}
