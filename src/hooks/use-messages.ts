import { useAtomValue } from 'jotai/utils';
import { useMemo } from 'react';
import { messagesAtom, roomIdAtom } from '../state';

export function useMessages() {
  const messages_ = useAtomValue(messagesAtom);
  const roomId = useAtomValue(roomIdAtom);
  const messages = useMemo(() => {
    return Object.values(messages_)
      .filter((it) => it.chatRoomId === roomId)
      .sort((m1, m2) => m1.timestamp.getTime() - m2.timestamp.getTime());
  }, [messages_, roomId]);

  return messages;
}
