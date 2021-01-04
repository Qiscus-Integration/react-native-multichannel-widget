import {View} from 'react-native';
import {Button, Modal, Portal, TextInput} from 'react-native-paper';
import * as React from 'react';
import {useEffect, useState} from 'react';
import Widget from 'react-native-multichannel-widget';
import * as PushNotification from 'react-native-push-notification';

function HomeScreen({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [visible, setVisible] = useState(false);
  const widget = Widget();
  const AppId = 'ADD APP ID QISCUS MULTICHANNEL HERE';

  const submit = () => {
    setNameError(name === '');
    setEmailError(email === '');
    if (name !== '' && email !== '') {
      hideModal()
      navigation.navigate('Chat', {
        name: name,
        email: email,
      });
    }
  };
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  useEffect(() => {
    widget.setup(AppId, {
      //title: 'Customer Service',
      //subtitle: 'ready to serve',
      //avatar : 'https://www.qiscus.com/images/faveicon.png'
    });

    PushNotification.configure({
      onRegister: function({token}) {
        localStorage.setItem('FCM_TOKEN', token);
      },
      onNotification: function({data}) {
        // const payload = JSON.parse(data.payload)
        //console.log('REMOTE NOTIFICATION ==>', JSON.stringify(payload));
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
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
