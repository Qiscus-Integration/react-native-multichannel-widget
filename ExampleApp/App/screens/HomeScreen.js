import React, {useEffect, useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {toProperCase} from '../helpers/Utils';
import Icon from 'react-native-vector-icons/Ionicons';
import {Text} from 'react-native-paper';
import Widget from '@qiscus-community/react-native-multichannel-widget';
import * as PushNotification from 'react-native-push-notification';
import CustomStatusBar from "../common/StatusBar";

const HomeScreen = ({route, navigation}) => {
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={{
                        padding: 10,
                    }}
                    onPress={() => {
                        navigation.replace('Login');
                        widget.endSession();
                        AsyncStorage.removeItem('Name');
                        AsyncStorage.removeItem('Email');
                    }}>
                    <Icon name="power" size={22} color="#ffff"/>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [fcmToken, setFcmToken] = useState('');
    const widget = Widget();
    const {roomId} = widget.state;

    useEffect(() => {
        AsyncStorage.getItem('Name')
            .then(value => {
                setName(toProperCase(value));
            });
        AsyncStorage.getItem('Email')
            .then(value => {
                setEmail(toProperCase(value));
            });

        AsyncStorage.getItem('FcmToken')
            .then(value => {
                setFcmToken(value);
            });

        PushNotification.configure({
            onNotification: function (notification) {
                openChat()
            },
        });

    }, []);

    const openChat = () => {
        let extras = {
            user_id: "user01",
            is_priority: true
        }
        let messageExtras = {
            "lang": "en"
        }

        let additionalInfo = {
            "Full Name": name,
            "Email address": email
        }

        if (!roomId) {
            let options = {
                userId: email,
                name : name,
                extras: extras,
                deviceId: fcmToken,
                additionalInfo: additionalInfo,
                messageExtras : messageExtras,
            }
            widget.initiateChat(options)
                .then(data => {
                    //console.log(data)
                })
                .catch(e => {
                    console.log('error login', e);
                });
        }
        navigation.navigate('Chat');
    }
    return (
        <View style={{
            flex: 1,
            padding: 16,
        }}>
            <CustomStatusBar/>
            <View
                style={{
                    padding: 20,
                    alignSelf: 'center',
                }}>
                <Image
                    style={{
                        width: 150,
                        height: 150,
                    }}
                    source={require('../images/cs.png')}
                />
            </View>
            <Text style={{fontSize: 20}}>We are ready to help at any time</Text>
            <Text style={{fontSize: 16}}>Hi {name}, Please contact us at any time via
                chat.</Text>
            {roomId == null && <View style={{
                alignItems: 'center',
            }}>
                <TouchableOpacity
                    onPress={() => openChat()}
                    style={{
                        width: 70,
                        height: 70,
                        paddingRight: 10,
                        paddingBottom: 10,
                    }}>
                    <Icon name="chatbubbles-sharp" size={30} color="#ACACAC"/>
                    <Text>Chat</Text>
                </TouchableOpacity>
            </View>}
        </View>
    );
};

export default HomeScreen;
