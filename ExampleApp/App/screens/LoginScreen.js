import {View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import * as React from 'react';
import {useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import {clearNotification} from '../helpers/NotificationHelper';
import * as PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {HEADER_BACKGROUND} from '../config';
import CustomStatusBar from "../common/StatusBar";

function LoginScreen({navigation}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [nameError, setNameError] = useState(false);

    const submit = () => {
        const isEmailValid = validateEmail(email);
        setNameError(name === '');
        setEmailError(!isEmailValid);
        if (name !== '' && isEmailValid) {
            _setName(name);
            _setEmail(email);
            navigation.replace('Home', {
                name: name,
                email: email,
            });
        }
    };

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const _setName = value => AsyncStorage.setItem('Name', value.toString());

    const _setEmail = value => AsyncStorage.setItem('Email', value.toString());

    useEffect(() => {
        let name = ''
        let email = ''
        setTimeout(() => {
            AsyncStorage.multiGet(['Email', 'Name'])
                .then(value => {
                    value.forEach(v => {
                        if (v[0] === 'Email' && v[1] != null) {
                            email = v[1];
                        }
                        if (v[0] === 'Name' && v[1] != null) {
                            name = v[1]
                        }

                        if (name !== '' || email !== '') navigation.replace('Home')

                    });
                })

        }, 500);
        setupPushNoif();
    }, []);

    async function setupPushNoif() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            clearNotification();
            const token = await messaging().getToken();
            AsyncStorage.setItem('FcmToken', token.toString())
            messaging().onMessage(async remoteMessage => {
                let {title, body} = remoteMessage.notification;
                let payload = JSON.parse(remoteMessage.data.payload)
                let {type} = payload
                if (type === "file_attachment") body = "File Attachment"

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
            <CustomStatusBar/>
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
                color={HEADER_BACKGROUND}
                mode="contained"
                uppercase={false}
                onPress={() => submit(email, name)}>
                Login
            </Button>
        </View>
    );
}

export default LoginScreen;
