<p align="center">
    <a href="https://getferdi.com/services">
      <img src="./screenshot.png" alt=""  width="260" height="510" />
    </a>
</p>
<h3 align="center">
  React Native Multichannel
</h3>
<p align="center">
  The most complete chat UI Multichannel for React Native
</p>

## Dependency

- Minimum RN `>= 0.59`

## Installation

- Using [npm](https://www.npmjs.com/#getting-started): `npm i @qiscus-integration/react-native-multichannel-widget`

## USAGE
We use Hooks to synchronize data. To make it work we have to explicitly insert a mount point in your app like this:
```
// in your entry file like `App.js`
import {MultichannelWidgetProvider} from 'react-native-multichannel-widget';

// in your render function 
return (
  <MultichannelWidgetProvider>  // <- use RootSiblingParent to wrap your root component
    <App />
  </MultichannelWidgetProvider>
);
```
## Initialization Widget
```
import Widget from 'react-native-multichannel-widget';

const widget = Widget();
widget.setup(AppId, {
      title: 'selamat datang', //set custom title
      subtitle: 'ready to serve', //set custom subtitle
      avatar : '' //set custom avatar
    });

```
## Initiate Chat Room
```
 widget.initiateChat('EMAIL', 'NAME', 'FCM_TOKEN')
            .then(result => {
                
            })
            .catch(e => {
                
            })
```

## Use Header Component 
```
<Header
    onBackPress={() => navigation.goBack()}
/>
```
## Use Chat Component
```
<MultichannelWidget
            onSuccessGetRoom={room => {
            }}
            onDownload={onDownload}
            onPressSendAttachment={onPressSendAttachment}
        />
```
 
## Example App
Example folder contains an example app to demonstrate how to use this package.

## Get Unread Message Count
```
widget.getUnreadCount(callback)
```

## Remove current user
```
widget.clearUser()
```
## Remove Notification
```
widget.removeNotification('FCM_TOKEN')
```
 
