import {View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import * as React from 'react';
import {useEffect, useState} from 'react';
import Widget from '@qiscus-integration/react-native-multichannel-widget';
import messaging from '@react-native-firebase/messaging';
import {clearNotification} from '../helpers/NotificationHelper';
import * as PushNotification from 'react-native-push-notification';

function LoginScreen({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const widget = Widget();
  const AppId = 'ADD APP ID QISCUS MULTICHANNEL HERE';

  const submit = () => {
    const isEmailValid = validateEmail(email);
    setNameError(name === '');
    setEmailError(!isEmailValid);
    if (name !== '' && isEmailValid) {
      widget.initiateChat(email, name, localStorage.getItem('FCM_TOKEN'))
        .then(data => {
          //console.log(data)
        })
        .catch(e => {
          console.log('error login', e);
        });

      navigation.replace('Home',{
        name: name,
        email: email
      });
    }
  };

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  useEffect(() => {
    widget.setup(AppId, {
      //title: 'Customer Service',
      //subtitle: 'ready to serve',
      //avatar : 'https://www.qiscus.com/images/faveicon.png'
    });
    setupPushNoif()
  }, []);

  async function setupPushNoif() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      clearNotification();
      const token = await messaging().getToken();
      localStorage.setItem('FCM_TOKEN', token);
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        const {title, body} = remoteMessage.notification;
        PushNotification.localNotification({
          autoCancel: true,
          title: title,
          message: body,
          vibrate: false,
          playSound: false,
        });
      });

    }
  }
  return (
    <View style={{flex: 1, padding: 16}}>
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
        Login
      </Button>
    </View>
  );
}

export default LoginScreen;
