import { useAtomValue } from 'jotai/utils';
import { useEffect } from 'react';
import { roomAtom } from '../state';
import type { IUseCurrentChatRoom } from '../types';
import { useDeleteMessage } from './use-delete-message';
import { useLoadMoreMessages } from './use-load-more-message';
import { useMessages } from './use-messages';
import { useQiscus } from './use-qiscus';
import { useSendMessage } from './use-send-message';

export function useCurrentChatRoom(): IUseCurrentChatRoom {
  const qiscus = useQiscus();
  const room = useAtomValue(roomAtom);
  const messages = useMessages();

  const sendMessage = useSendMessage();
  const deleteMessage = useDeleteMessage();
  const loadMoreMessages = useLoadMoreMessages();

  useEffect(() => {
    if (room != null) qiscus.subscribeChatRoom(room);
    return () => {
      if (room != null) qiscus.unsubscribeChatRoom(room);
    };
  }, [qiscus, room]);

  return {
    room,
    messages,
    sendMessage,
    deleteMessage,
    loadMoreMessages,
  };
}
