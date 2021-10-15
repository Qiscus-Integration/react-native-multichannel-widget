# [Widget] Documentation React Native

## Requirements

- ReactNative: ^0.63.4

## Dependency

- @react-native-async-storage/async-storage: ^1.15.9
- react-native-document-picker: ^7.1.0

## Installation

```
# Qiscus Multichannel main package
yarn add @qiscus-community/react-native-multichannel-widget

# Dependencies required for qiscus multichannel
yarn add @react-native-async-storage/async-storage react-native-document-picker
```

## How To Use

### Initialization

In order to use `QiscusMultichannelWidge`t, you need to initialize it with your AppID (`YOUR_APP_ID`). Get more information to get AppID from [Qiscus Multichannel Chat page](https://multichannel.qiscus.com/)

```javascript
// Wrap your outer most component with `MultichannelWidgetProvider`
// for example
import { MultichannelWidgetProvider } from '@qiscus-community/react-native-multichannel-widget';
<MultichannelWidgetProvider appId={APP_ID}>
  <App />
</MultichannelWidgetProvider>;
```

After the initialization, you can access all the widget's functions.

### Set The User

Set UserId before start the chat, this is mandatory.

```javascript
import { useMultichannelWidget } from '@qiscus-community/react-native-multichannel-widget';

// ... inside your component
const widget = useMultichannelWidget();
widget.setUser({
  userId: 'unique-user-id',
  displayName: 'Display Name for this user',
  avatarUrl: 'https://via.placeholder.com/200',
});

// if you want to set user properties
widget.setUser({
  userId: 'unique-user-id',
  displayName: 'Display Name for this user',
  avatarUrl: 'https://via.placeholder.com/200',
  userProperties: {
    extra_property_key: 'extra property value',
  },
});
```

### Get Login Status

Use this function to check whether the user has already logged in.

```javascript
import { useCurrentUser } from '@qiscus-community/react-native-multichannel-widget';

// ... inside your component
const user = useCurrentUser();

// check user value null or not
const isLoggedIn = useMemo(() => user == null, [user]);
```

### Start Chat

Use this function to start a chat.

```javascript
widget
  .initiateChat()
  .then(() => console.log('success initiating chat'))
  .catch((e: unknown) => console.error('error while initiating chat'));
}
```

### Clear User

Use this function to clear the logged-in users.

```javascript
widget.clearUser();
```

### Hide system message

configure system message visibility by calling setShowSystemMessage(isShowing: Bool).

```javascript
widget.setHideUIEvent();
```

## Customization

We provide several functions to customize the User Interface.

### Config

Use this method to configure the widget properties.
Channel Id is an identity for each widget channel. If you have a specific widget channel that you want to integrate into the mobile in-app widget, you can add your channel_id when you do initiateChat.

| Method Name                         | Description                                                      |
| ----------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------ |
| setRoomTitle                        | Set room name base on customer's name or static default.         |
| setRoomSubTitle                     |                                                                  |
|                                     | setRoomSubTitle(IRoomSubtitleConfig.Enabled)                     | Set enable room sub name by the system.          |
|                                     | setRoomSubTitle(IRoomSubtitleConfig.Disabled)                    | Set disable room sub name.                       |
|                                     | setRoomSubTitle(IRoomSubtitleConfig.Editable, "Custom subtitle") | Set enable room sub name base on static default. |
| setHideUIEvent                      | Show/hide system event.                                          |
| setAvatar                           |                                                                  |
|                                     | setAvatar(IAvatarConfig.Enable)                                  | Set enable avatar and name                       |
|                                     | setAvatar(IAvatarConfig.Disabled)                                | Set disable avatar and name                      |
| setEnableNotification               | Set enable app notification.                                     |
| setChannelId(channelId: channel_id) | Use this function to set your widget channel Id                  |

### Color

| Method Name                     | Description                                                  |
| ------------------------------- | ------------------------------------------------------------ |
| setNavigationColor              | Set navigation color.                                        |
| setNavigationTitleColor         | Set room title, room subtitle, and back button border color. |
| setSendContainerColor           | Set icon send border-color.                                  |
| setSendContainerBackgroundColor | Set send container background-color.                         |
| setFieldChatBorderColor         | Set field chat border-color.                                 |
| setFieldChatTextColor           | Set field chat text color.                                   |
| setSystemEventTextColor         | Set system event text and border color.                      |
| setLeftBubbleColor              | Set left bubble chat color (for: Admin, Supervisor, Agent).  |
| setLeftBubbleTextColor          | Set left bubble text color (for: Admin, Supervisor, Agent).  |
| setRightBubbleColor             | Set right bubble chat color (Customer).                      |
| setRightBubbleTextColor         | Set right bubble text color (Customer).                      |
| setTimeLabelTextColor           | Set time text color.                                         |
| setTimeBackgroundColor          | Set time background color.                                   |
| setBaseColor                    | Set background color of the room chat.                       |
| setEmptyTextColor               | Set empty state text color.                                  |
| setEmptyBackgroundColor         | Set empty state background color.                            |

![Color Customization Image](/Readme/colorConfig.png)

## How to Run the Example

1. **Get your APPID**

- Go to [Qiscus Multichannel Chat page](https://multichannel.qiscus.com/) to register your email
- Log in to Qiscus Multichannel Chat with yout email and password
- Go to ‘Setting’ menu on the left bar
- Look for ‘App Information’
- You can find APPID in the App Info

2. **Activate Qiscus Widget Integration**

- Go to ‘Integration’ menu on the left bar
- Look for ‘Qiscus Widget’
- Slide the toggle to activate the Qiscus widget

3. **Run npm install**

After cloning the example, you need to run this code to install all C*ocoapods* dependencies needed by the Example

```
yarn
```

4. **Set YOUR_APP_ID in the Example**

- Open example/src/App.tsx
- Replace the `APP_ID` at line 12 with your appId

```javascript
<MultichannelWidgetProvider appId={APP_ID}>
  <App />
</MultichannelWidgetProvider>
```

5. **Start Chat**

The Example is ready to use. You can start to chat with your agent from the Qiscus Multichannel Chat dashboard.
