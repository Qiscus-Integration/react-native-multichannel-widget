import { useAtomCallback } from 'jotai/utils';
import { messagesAtom, qiscusAtom } from '../state';
import type { Message } from '../types';
import type { IQMessage } from 'qiscus-sdk-javascript';

export function useSendMessage(): (message: Message) => Promise<Message> {
  return useAtomCallback(async (get, set, message) => {
    if (message.text == null) {
      throw new Error('Message text can not be empty');
    }

    // Optimistic insert
    message.status = 'sending';
    set(messagesAtom, (msg) => {
      msg[message.uniqueId] = message;
    });

    try {
      let m = await get(qiscusAtom).sendMessage(
        message as unknown as IQMessage
      );

      if (m != null) {
        set(messagesAtom, (msg) => {
          msg[m.uniqueId] = m as any;
        });
      }

      return m as any;
    } catch (e) {
      set(messagesAtom, (msg) => {
        delete msg[message.uniqueId];
      });
      throw e;
    }
  });
}
