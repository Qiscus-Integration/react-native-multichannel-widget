import { useAtomCallback } from 'jotai/utils';
import type { Message, Room } from '../types';
import {
  avatarAtom,
  currentUserAtom,
  messagesAtom,
  qiscusAtom,
  roomAtom,
  roomIdAtom,
  subtitleAtom,
} from '../state';

export function useUpdateRoomInfo() {
  let cb = useAtomCallback(async (get, set) => {
    const qiscus = get(qiscusAtom);
    let currentUser = get(currentUserAtom);
    let roomId = get(roomIdAtom);

    if (roomId == null) {
      return [null, [] as Message[]] as [Room | null, Message[]];
    }

    let [room, messages] = await qiscus.getChatRoomWithMessages(roomId!);
    await qiscus
      .getPreviousMessagesById(room.id, 20, messages[0]?.id)
      .then((msgs) => {
        messages.push(...msgs);
      });

    set(roomAtom, (item) => {
      return { ...item, ...room };
    });
    set(messagesAtom, (items) => {
      for (let comment of messages) {
        items[comment.uniqueId] = comment;
      }
    });

    let subtitle: string[] = [];
    let avatar = room.avatarUrl;
    room.participants.forEach((participant) => {
      if (participant.id === currentUser?.id) {
        subtitle.unshift(`You`);
      } else {
        const type = participant.extras?.type;
        if (type === 'agent') {
          avatar = participant.avatarUrl;
        }
        subtitle.push(participant.name);
      }
    });

    set(subtitleAtom, subtitle.join(', '));
    set(avatarAtom, avatar);

    return [room, messages] as [Room | null, Message[]];
  });

  return cb;
}
