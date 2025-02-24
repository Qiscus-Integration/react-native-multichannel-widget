import type QiscusSDK from 'qiscus-sdk-javascript';
import type {
  IQAccount as Account,
  IQUser as User,
  IQChatRoom as Room,
  IQMessage,
  IQParticipant as Participant,
} from 'qiscus-sdk-javascript';
export type { QiscusSDK, Room, User, Account, Participant };

export type Message = {
  type: IQMessage['type'] | 'carousel';
} & IQMessage;

export enum IRoomSubtitleConfig {
  Enabled = 'enabled',
  Disabled = 'disabled',
  Editable = 'editable',
}
export enum IAvatarConfig {
  Enabled = 'enabled',
  Disabled = 'disabled',
}

// Notification
type INotificationConfig = {
  setEnableNotification: (enable: boolean) => void;
  setDeviceId: (deviceId: string) => void;
};

// Initialization
export type IQiscusMultichannelWidget = {
  (appId: string): IUseMultichannelWidget;
};

// Login Form
export type ISetUserParams = {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  userProperties?: Record<string, unknown>;
};
type IAuthenticationForm = {
  setUser(params: ISetUserParams): void;
  setChannelId(channelId: number | string): void;
  clearUser(): void;
};

// Start Chat
type IStartChat = {
  initiateChat(): Promise<void>;
};

// Chat Room
export type IChatRoomConfigSetter = {
  setRoomTitle(title: string): void;
  setRoomSubTitle(enabled: IRoomSubtitleConfig.Enabled): void;
  setRoomSubTitle(enabled: IRoomSubtitleConfig.Disabled): void;
  setRoomSubTitle(
    enabled: IRoomSubtitleConfig.Editable,
    subtitle: string
  ): void;
  setHideUIEvent(): void;
  setAvatar(enabled: IAvatarConfig.Enabled): void;
  setAvatar(enabled: IAvatarConfig.Disabled): void;
};

// Themes
export type IThemesSetter = {
  setNavigationColor(color: string): void;
  setNavigationTitleColor(color: string): void;
  setSystemEventTextColor(color: string): void;
  setLeftBubbleColor(color: string): void;
  setRightBubbleColor(color: string): void;
  setLeftBubbleTextColor(color: string): void;
  setRightBubbleTextColor(color: string): void;
  setTimeLabelTextColor(color: string): void;
  setTimeBackgroundColor(color: string): void;
  setBaseColor(color: string): void;
  setEmptyTextColor(color: string): void;
  setEmptyBackgroundColor(color: string): void;
  setSendContainerColor(color: string): void;
  setSendContainerBackgroundColor(color: string): void;
  setFieldChatBorderColor(color: string): void;
  setFieldChatTextColor(color: string): void;
  setFieldChatIconColor(color: string): void;
};
export type IUseMultichannelWidget = INotificationConfig &
  IAuthenticationForm &
  IStartChat &
  IChatRoomConfigSetter &
  IThemesSetter;

export type SetupOptions = {
  baseURLMultichannel: string;
  baseURLSdk?: string;
  mqttURLSdk?: string;
  brokerLbUrlSdk?: string;
  uploadUrlSdk?: string;
};
export type AppState = {
  title: string;
  subtitle: string;
  avatar: string;
  progressUploading: string | number;
  attachment: {
    type: string;
    value: string;
    payload: any;
  };
  typingStatus: boolean;
  unReadCount: number;
  roomId: number | null;
  loginChecked: boolean;
  currentUser: User | null;
  loginMessage: string | null;
  replayMessage: object | null;
  messageExtras: object | null;
};
export type InitiateChatOptions = {
  userId: ISetUserParams['userId'];
  name: ISetUserParams['displayName'];
  avatar?: ISetUserParams['avatarUrl'];
  userProperties?: ISetUserParams['userProperties'];
  deviceId?: string;
  extras?: Record<string, any>;
  additionalInfo?: Record<string, any>;
  messageExtras?: Record<string, any>;
  channelId?: string | number;
};
export type IUseCurrentChatRoom = {
  room?: Room;
  messages: Message[];
  sendMessage(message: Message): Promise<Message>;
  deleteMessage(messageUniqueIds: string[]): Promise<Message[]>;
  loadMoreMessages(lastMessageId: number): Promise<Message[]>;
};

// Carousel types
export type CardAction = {
  type: 'postback' | 'link';
  postback_text?: string;
  payload: {
    url: string;
    method: 'get' | 'post';
    payload: Record<string, unknown>;
  };
};
export type CardButton = {
  label: string;
} & CardAction;
export type Card = {
  image: string;
  title: string;
  description: string;
  default_action: CardAction;
  buttons: CardButton[];
};
