import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';
import { atomWithImmer } from 'jotai/immer';
import QiscusSDK from 'qiscus-sdk-javascript';
import type {
  Account,
  AppState,
  InitiateChatOptions,
  Message,
  Room,
  SetupOptions,
} from './types';

export const qiscus = new QiscusSDK();
export const qiscusAtom = atom<QiscusSDK>(() => qiscus);
export const currentUserAtom = atomWithReset<Account | undefined>(undefined);
export const roomAtom = atomWithImmer<Room | undefined>(undefined);
export const messagesAtom = atomWithImmer<Record<string, Message>>({});
export const messagesListAtom = atom((get) => {
  let messages = Object.values(get(messagesAtom));
  // messages.sort((m1, m2) => m1.unix_nano_timestamp - m2.unix_nano_timestamp);
  messages.sort((m1, m2) => m1.timestamp.getTime() - m2.timestamp.getTime());

  return messages;
});

export const appIdAtom = atom<string | undefined>(undefined);
appIdAtom.debugLabel = 'appId';
export const optionsAtom = atomWithImmer<SetupOptions>({
  baseURLMultichannel: 'https://multichannel.qiscus.com',
});

export const titleAtom = atomWithReset('Customer Service');
export const subtitleAtom = atomWithReset('You');
export const avatarAtom = atomWithReset<string | undefined>(undefined);
export const typingStatusAtom = atomWithReset(false);
export const roomIdAtom = atomWithReset<number | null>(null);
export const messageExtrasAtom = atomWithReset<Record<string, any> | undefined>(
  undefined
);

// User Config
export const userConfigAvatarAtom = atomWithReset<string | undefined>(
  undefined
);
export const userConfigDisplayNameAtom = atomWithReset<string | undefined>(
  undefined
);
export const userConfigIdAtom = atomWithReset<string | undefined>(undefined);
export const userConfigPropertiesAtom = atomWithReset<
  Record<string, unknown> | undefined
>(undefined);
export const channelIdAtom = atomWithReset<string | number | undefined>(
  undefined
);

// LAST SESSIONS
export const STORAGE = {
  lastUserId: 'MultichannelWidget::last-user-id',
  lastRoomId: 'MultichannelWidget::last-room-id',
  lastUserData: 'MultichannelWidget::last-user-data',
  lastUserToken: 'MultichannelWidget::last-user-token',
};
export const lastInitiateChatParamsAtom = atom<InitiateChatOptions | undefined>(
  undefined
);
export const lastUserDataAtom = atomWithReset<Account | undefined>(undefined);
export const lastUserTokenAtom = atomWithReset<string | undefined>(undefined);

// Notification Config
export const notificationEnabledAtom = atomWithReset(false);
export const deviceIdAtom = atomWithReset<string | undefined>(undefined);

// Room Config
export const roomTitleAtom = atomWithReset<string | undefined>(undefined);
export const roomSubtitleConfigAtom = atomWithReset<
  'enabled' | 'disabled' | 'editable'
>('enabled');
export const roomSubtitleTextAtom = atomWithReset<string | undefined>(
  undefined
);
export const roomSystemEventHiddenAtom = atomWithReset<boolean>(false);
export const roomSenderAvatarEnabledAtom = atomWithReset<boolean>(true);

/// Themes
export const navigationColorThemeAtom = atomWithReset('#55B29A');
export const navigationTitleColorThemeAtom = atomWithReset('#ffffff');
export const systemEventTextColorThemeAtom = atomWithReset('#ffffff');
export const rightBubbleColorThemeAtom = atomWithReset('#55B29A');
export const rightBubbleTextColorThemeAtom = atomWithReset('#FFFFFF');
export const leftBubbleColorThemeAtom = atomWithReset('#F4F4F4');
export const leftBubbleTextColorThemeAtom = atomWithReset('#666666');
export const timeLabelTextColorThemeAtom = atomWithReset('#7B7B7B');
export const timeBackgroundColorThemeAtom = atomWithReset('transparent');
export const baseColorThemeAtom = atomWithReset('#F9F9F9');
export const emptyTextColorThemeAtom = atomWithReset('#999999');
export const emptyBackgroundColorThemeAtom = atomWithReset('#f9f9f9');
export const sendContainerColorThemeAtom = atomWithReset('#fff');
export const sendContainerBackgroundColorThemeAtom = atomWithReset('#FAFAFA');
export const fieldChatBorderColorThemeAtom = atomWithReset('#E3E3E3');
export const fieldChatTextColorThemeAtom = atomWithReset('#333');
