import { useAtomCallback } from 'jotai/utils';
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
    let roomId = get(roomIdAtom);

    if (roomId == null) return null;

    let [room, messages] = await qiscus.getChatRoomWithMessages(roomId!);
    let currentUser = get(currentUserAtom);

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

    return room;
  });

  return cb;
}
