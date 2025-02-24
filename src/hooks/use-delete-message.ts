import { messagesAtom, qiscusAtom } from '../state';
import type { Message } from '../types';
import { useAtomCallback } from 'jotai/utils';

export function useDeleteMessage(): (
  messageUniqueIds: string[]
) => Promise<Message[]> {
  return useAtomCallback(async (get, set, messageUniqueIds) => {
    let data = await get(qiscusAtom).deleteMessages(messageUniqueIds);

    set(messagesAtom, (items) => {
      for (const uniqueId of messageUniqueIds) {
        if (Object.hasOwn(items, uniqueId)) {
          delete items[uniqueId];
        }
      }
    });

    return data;
  });
}
