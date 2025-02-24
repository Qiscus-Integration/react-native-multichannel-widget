import { PortalProvider } from '@gorhom/portal';
import invariant from 'invariant';
import { Provider } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import React, { useEffect } from 'react';
import { appIdAtom } from './state';
export { Header } from './components/header/index';
export {
  useCurrentChatRoom,
  useCurrentUser,
  useDebounceValue,
  useDeleteMessage,
  useDifference,
  useClearUser,
  useGetUnreadCount,
  useInitiateChat,
  useLoadMoreMessages,
  useMessages,
  useMultichannelWidget,
  useOnMessageDeleted,
  useOnMessageDelivered,
  useOnMessageRead,
  useOnMessageReceived,
  useOnUserTyping,
  useQiscus,
  useSendMessage,
  useSetup,
  useUpdateRoomInfo,
} from './hooks/index';
export { MultichannelWidget } from './screens/multichannel-widget';
export { IAvatarConfig, IRoomSubtitleConfig } from './types';

const WidgetContext = React.createContext(undefined);

type IWidgetProviderProps = {
  appId: string;
  children: React.ReactNode;
};
function WidgetProvider(props: IWidgetProviderProps) {
  const appId = props.appId;
  invariant(appId, 'MultichannelWidgetProvider must have `appId` as a prop');

  const setAppId = useUpdateAtom(appIdAtom);
  useEffect(() => {
    setAppId(appId);
  }, [appId, setAppId]);

  return (
    <WidgetContext.Provider value={undefined}>
      {props.children}
    </WidgetContext.Provider>
  );
}

export function MultichannelWidgetProvider(props: IWidgetProviderProps) {
  return (
    <Provider>
      <PortalProvider>
        <WidgetProvider {...props} />
      </PortalProvider>
    </Provider>
  );
}
