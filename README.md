# [Widget] Documentation React Native

## Requirements

- React Native: 0.76+ (example app uses RN 0.76.x)

## Dependency

| Package | Required | Notes |
|---|---|---|
| `@react-native-async-storage/async-storage` | ✅ Yes | Session persistence |
| `react-native-svg` | ✅ Yes | Icons |
| `@react-native-documents/picker` | ✅ Yes | Built-in attachment picker used by widget |

## Installation

```sh
# Qiscus Multichannel main package
yarn add @qiscus-community/react-native-multichannel-widget

# Required peer dependencies
yarn add @react-native-async-storage/async-storage react-native-svg @react-native-documents/picker@10.1.7
```

For contributor and maintainer workflow (workspace setup, example app, lint/test/release), see [CONTRIBUTING.md](./CONTRIBUTING.md).

## How To Use

### Initialization

In order to use `QiscusMultichannelWidget`, you need to initialize it with your AppID (`YOUR_APP_ID`). Get more information to get AppID from [Qiscus Multichannel Chat page](https://multichannel.qiscus.com/)

```javascript
// Wrap your outer most component with `MultichannelWidgetProvider`
// for example
import { MultichannelWidgetProvider } from '@qiscus-community/react-native-multichannel-widget';
<MultichannelWidgetProvider appId={APP_ID}>
  <App />
</MultichannelWidgetProvider>;
```

After the initialization, you can access all the widget's functions.

## File Picker

`MultichannelWidget` now uses `@react-native-documents/picker` internally.
You do not need to pass `pickImage` / `pickDocument` props anymore.

```tsx
import { MultichannelWidget } from '@qiscus-community/react-native-multichannel-widget';

<MultichannelWidget onBack={handleBack} />;
```

Attachment behavior:
- Image button opens image picker only.
- File button opens document/file picker only (non-image mime types).

Version guidance:
- Minimum recommended version: `@react-native-documents/picker@10.1.7`
- Supported peer range in this library: `>=10.1.7`
- For React Native `<0.79`, keep using `@react-native-documents/picker` `10.x`.
- `react-native-document-picker` package name is deprecated and has been renamed.
- `@react-native-documents/picker` is native-only, so Expo requires development build (`expo run:android` / `expo run:ios`), not Expo Go.

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
const isLoggedIn = useMemo(() => user != null, [user]);
```

### Start Chat

Use this function to start a chat.

```javascript
widget
  .initiateChat()
  .then(() => console.log('success initiating chat'))
  .catch((e: unknown) => console.error('error while initiating chat'));
```

### Clear User

Use this function to clear the logged-in users.

```javascript
widget.clearUser();
```

### Hide system message

Configure system message visibility by calling `setHideUIEvent()`.

```javascript
widget.setHideUIEvent();
```

## Customization

We provide several functions to customize the User Interface.

### Config

Use this method to configure the widget properties.
Channel Id is an identity for each widget channel. If you have a specific widget channel that you want to integrate into the mobile in-app widget, you can add your channel_id when you do initiateChat.

| Method Name                         | Description                                                      |
| ----------------------------------- | ---------------------------------------------------------------- |
| setRoomTitle                        | Set room name base on customer's name or static default.         |
| setRoomSubTitle                     |                                                                  |
|                                     | setRoomSubTitle(IRoomSubtitleConfig.Enabled)                     | Set enable room sub name by the system.          |
|                                     | setRoomSubTitle(IRoomSubtitleConfig.Disabled)                    | Set disable room sub name.                      |
|                                     | setRoomSubTitle(IRoomSubtitleConfig.Editable, "Custom subtitle") | Set enable room sub name base on static default. |
| setHideUIEvent                      | Show/hide system event.                                          |
| setAvatar                           |                                                                  |
|                                     | setAvatar(IAvatarConfig.Enabled)                                 | Set enable avatar and name                       |
|                                     | setAvatar(IAvatarConfig.Disabled)                                | Set disable avatar and name                      |
| setEnableNotification               | Set enable app notification.                                     |
| setChannelId(channelId: channel_id) | Use this function to set your widget channel Id                  |

### Color

| Method Name                     | Description                                                  |
| ------------------------------- | ------------------------------------------------------------ |
| setNavigationColor              | Set navigation color.                                        |
| setNavigationTitleColor         | Set room title, room subtitle, and back button border color. |
| setSendContainerColor           | Set field chat background-color.                             |
| setSendContainerBackgroundColor | Set send container background-color.                         |
| setFieldChatBorderColor         | Set field chat border-color.                                  |
| setFieldChatTextColor           | Set field chat text color.                                    |
| setFieldChatIconColor           | Set field chat icon color.                                    |
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

## Development: Run the Example App

Use these steps when developing this library locally.

1. **Install dependencies (workspace root)**

```sh
corepack yarn install
```

2. **Get your APP_ID**

- Go to [Qiscus Multichannel Chat page](https://multichannel.qiscus.com/) and sign in
- Open `Setting` -> `App Information`
- Copy your `APP_ID`

3. **Activate Qiscus Widget Integration**

- Open `Integration` in Qiscus dashboard
- Enable `Qiscus Widget`

4. **Set `APP_ID` in example app**

- Open `example/src/App.tsx`
- Replace `APP_ID` with your app ID

5. **Start Metro (terminal 1, repo root)**

```sh
corepack yarn example:metro
```

6. **Run app target (terminal 2, repo root)**

```sh
# Android
corepack yarn example:android

# iOS
corepack yarn example:ios

# Web
corepack yarn example:web
```

Optional Android device selection:

```sh
corepack yarn example:android -- --device
```

### Troubleshooting

- `sh: expo: command not found`: install dependencies first with `corepack yarn install`, then run scripts from repository root.
- `No version is set for command yarn`: use `corepack yarn ...` instead of plain `yarn`.
- Native code change is not reflected: rerun `corepack yarn example:android` or `corepack yarn example:ios` to rebuild native app.

## Library Maintenance (Maintainers)

Run all commands from repository root:

```sh
corepack yarn typecheck
corepack yarn lint
corepack yarn test
corepack yarn prepare
```

For contribution, release, and commit rules, see [CONTRIBUTING.md](./CONTRIBUTING.md).
