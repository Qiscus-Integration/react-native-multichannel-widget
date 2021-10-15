import { messagesAtom, qiscusAtom } from '../state';
import type { Message } from '../types';
import { useAtomCallback } from 'jotai/utils';

export function useDeleteMessage(): (
  messageUniqueIds: string[]
) => Promise<Message[]> {
  return useAtomCallback(async (get, set, messageUniqueIds) => {
    let data = await get(qiscusAtom).deleteMessages(messageUniqueIds);

    set(messagesAtom, (items) => {
      let newItems = {} as Record<string, Message>;
      for (let key in items) {
        if (!messageUniqueIds.includes(key)) {
          newItems[key] = items[key];
        }
      }

      return newItems;
    });

    return data;
  });
}
