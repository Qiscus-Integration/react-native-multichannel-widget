import {View} from 'react-native';
import {Button, Modal, Portal, TextInput} from 'react-native-paper';
import * as React from 'react';
import {useEffect, useState} from 'react';
import Widget from '@qiscus-integration/react-native-multichannel-widget';
import * as PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';

function HomeScreen({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [visible, setVisible] = useState(false);
  const widget = Widget();
  const AppId = 'ADD APP ID QISCUS MULTICHANNEL HERE';

  const submit = () => {
    const isEmailValid = validateEmail(email)
    setNameError(name === '');
    setEmailError(!isEmailValid);
    if (name !== '' && isEmailValid) {
      hideModal()
      navigation.navigate('Chat', {
        name: name,
        email: email,
      });
    }
  };
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  async function setupPushNoif() {
    PushNotification.removeAllDeliveredNotifications();
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const token = await messaging().getToken();
      localStorage.setItem('FCM_TOKEN', token);
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        const {title, body} = remoteMessage.notification
        PushNotification.localNotification({
          autoCancel: true,
          title: title,
          message: body,
          vibrate: false,
          playSound: false,
        })
      });
    }
  }
  useEffect(() => {
    widget.setup(AppId, {
      //title: 'Customer Service',
      //subtitle: 'ready to serve',
      //avatar : 'https://www.qiscus.com/images/faveicon.png'
    });

    setupPushNoif()
  }, []);
  return (
    <View style={{flex: 1, padding: 16}}>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            margin: 15,
            borderRadius: 10,
          }}>
          <TextInput
            error={nameError}
            style={{
              marginTop: 10,
            }}
            label="Type your name"
            onChangeText={text => setName(text)}
            value={name}
          />

          <TextInput
            error={emailError}
            label="Type your email"
            onChangeText={text => setEmail(text)}
            value={email}
          />
          <Button
            style={{
              marginTop: 10,
            }}
            mode="contained"
            uppercase={false}
            onPress={() => submit()}>
            Start Chatting
          </Button>
        </Modal>
      </Portal>
      <View style={{
        position: 'absolute',
        bottom: 10,
        right: 10,
      }}>
        <Button
          style={{
            marginTop: 5,
          }}
          icon={require('../images/icon-chat.png')}
          mode="contained"
          uppercase={false}
          onPress={() => showModal()}>
          Talk to Us
        </Button>

      </View>
    </View>
  );
}

export default HomeScreen;
