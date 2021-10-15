import { useAtomCallback } from 'jotai/utils';
import { messagesAtom, qiscusAtom, roomAtom } from '../state';
import type { Message } from '../types';

export function useLoadMoreMessages(): (
  lastMessageId: number
) => Promise<Message[]> {
  return useAtomCallback(async (get, set, lastMessageId) => {
    let room = get(roomAtom);
    if (room == null) return [];

    let messages = await get(qiscusAtom).getPreviousMessagesById(
      room.id,
      lastMessageId,
      20
    );

    set(messagesAtom, (items) => {
      messages.forEach((m) => {
        items[m.uniqueId] = m;
      });
    });

    return messages;
  });
}
