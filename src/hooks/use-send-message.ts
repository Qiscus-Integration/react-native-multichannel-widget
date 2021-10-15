import { useAtomCallback } from 'jotai/utils';
import { messagesAtom, qiscusAtom } from '../state';
import type { Message } from '../types';

export function useSendMessage(): (message: Message) => Promise<Message> {
  return useAtomCallback(async (get, set, message) => {
    if (message.text == null) {
      throw new Error('Message text can not be empty');
    }

    let m = await get(qiscusAtom).sendMessage(message);

    if (m != null) {
      set(messagesAtom, (msg) => {
        msg[m!.uniqueId] = m!;
      });
    }

    return m!;
  });
}
