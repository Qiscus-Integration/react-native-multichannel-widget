import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useAtomCallback } from 'jotai/utils';
import {
  currentUserAtom,
  messageExtrasAtom,
  optionsAtom,
  qiscusAtom,
  roomIdAtom,
  STORAGE,
} from '../state';
import type { InitiateChatOptions } from '../types';
import { useGetSessions } from './use-get-sessions';
import { useUpdateRoomInfo } from './use-update-room-info';

const resolvedText = 'admin marked this conversation as resolved' as const;

export function useInitiateChat() {
  const updateRoomInfo = useUpdateRoomInfo();
  const getSessions = useGetSessions();

  let cb = useAtomCallback(async (get, set, arg: InitiateChatOptions) => {
    const qiscus = get(qiscusAtom);
    const opts = get(optionsAtom);
    const currentUser = get(currentUserAtom);
    const lastRoomId = get(roomIdAtom);

    if (currentUser != null && lastRoomId != null) {
      const [room, messages] = await updateRoomInfo();

      const lastMessageText1 = room?.lastMessage?.text;
      const lastMessageText2 = messages[messages.length - 1]?.text;

      const lastMessageResolved = [lastMessageText1, lastMessageText2]
        .map((it) => it?.toLowerCase())
        .some((it) => it?.includes(resolvedText) === true);
      const roomExtrasResolved = room?.extras?.is_resolved === true;

      const isResolved = roomExtrasResolved || lastMessageResolved;
      const isSessional = isResolved ? await getSessions() : false;

      console.log(
        `room are resolved(${isResolved}) and sessional(${isSessional})`
      );
      if (!isSessional) {
        console.log('room are not sessional, using existing room');
        // await updateRoomInfo();
        return currentUser;
      }
    }

    const nonce = await qiscus.getJWTNonce();
    let data = {
      app_id: qiscus.appId,
      user_id: arg.userId,
      name: arg.name,
      avatar: arg.avatar,
      sdk_user_extras: arg.extras,
      user_properties: arg.userProperties,
      nonce,
    };

    // @ts-ignore
    if (arg.channelId != null) data.channel_id = arg.channelId;

    const baseUrl = opts.baseURLMultichannel;
    const resp = await axios
      .post(`${baseUrl}/api/v2/qiscus/initiate_chat`, data)
      .then((r) => r.data.data)
      .catch((e) => {
        throw new Error(JSON.parse(e.request.response).errors.message);
      });

    const { identity_token, customer_room } = resp;
    const roomId = Number(customer_room.room_id);
    const user = await qiscus.setUserWithIdentityToken(identity_token);
    const userToken = qiscus.token;

    await AsyncStorage.multiSet([
      [STORAGE.lastRoomId, roomId.toString()],
      [STORAGE.lastUserId, user.id],
      [STORAGE.lastUserData, JSON.stringify(user)],
      [STORAGE.lastUserToken, userToken],
      [STORAGE.lastAppId, qiscus.appId],
    ]);

    if (arg.deviceId != null) {
      await qiscus.registerDeviceToken(arg.deviceId, false);
    }

    set(roomIdAtom, roomId);
    set(messageExtrasAtom, arg.messageExtras);
    set(currentUserAtom, (_) => user);

    await updateRoomInfo();

    return user;
  });

  return cb;
}
