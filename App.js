//GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
import React, {useEffect, useState} from 'react';
import {Image, Linking, StyleSheet, View, Button} from 'react-native';
import Header from './lib/components/common/Header';
import * as ImagePicker from 'expo-image-picker';
import Widget, {MultichannelWidgetProvider, MultichannelWidget, Qiscus} from './lib';
import {getFileExtension, getUrlFileName} from './lib/utils';
import Arrow from './lib/components/common/Arrow';
import {APP_ID, USER_ID_1, NAME_1, USER_ID_2, NAME_2, DEVICE_ID, CHANNEL_ID} from "react-native-dotenv"

let firstLoad = true

function ChatRoom({onBack}) {
    const widget = Widget();

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const {status} = await ImagePicker.requestCameraRollPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
        return (()=>{
            widget.endSession()
                .then(data=>{
                    console.log("end session", data)
                })
                .catch(e=>{
                    console.log("end session e", e)
                })
        })
    }, []);

    const pickImage = async (type) => {

        return new Promise((resolve, reject) => {
            ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: false,
                quality: 1,
            }).then(response => {
                if (response.cancelled) {
                    reject('User cancelled image picker');
                } else {
                    const source = {
                        uri: response.uri,
                        name: getUrlFileName(response.uri),
                        type: `${response.type}/${getFileExtension(response.uri)}`,
                        size: 1000,
                    };
                    resolve(source);
                }
            }).catch(e => {
                reject('ImagePicker Error: ', e);
            });


        });
    };

    return (
        <View style={styles.container}>
            <Header
                height={56}
                headerLeft={<Arrow
                    style={styles.arrowIcon}
                    onPress={() => {
                        onBack()
                    }}/>}
                style={{
                    backgroundColor: 'orange'
                }}
                textColor='white'
            />

            <MultichannelWidget
                onSuccessGetRoom={room => {
                    // console.log(room)
                }}
                onDownload={(url, fileName) => {
                    Linking.openURL(url);
                }}
                onPressSendAttachment={pickImage}
                renderTickSent={<Image source={require("./lib/assets/ic_check_sent.png")} style={styles.tick}/>}
                renderTickDelivered={<Image source={require("./lib/assets/ic_check_delivered.png")}
                                            style={styles.tick}/>}
                renderTickRead={<Image source={require("./lib/assets/ic_check_read.png")} style={styles.tick}/>}
                renderTickPending={<Image source={require("./lib/assets/ic_check_pending.png")} style={styles.tick}/>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        paddingBottom: 0,
        padding: 10,
    },
    arrowIcon: {
        height: 20,
        width: 20,
        marginRight: 10,
        marginLeft: 16,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tick: {height: 15, width: 15, marginRight: 3}
});

const Home = ({onPress}) => {
    const widget = Widget();
    useEffect(() => {
        if (firstLoad) {
            Qiscus.setup(APP_ID);
            firstLoad = false
        }
    }, []);

    const initChat = (userId, Name) => {
        let additionalInfo = {
            "Full Name": Name,
            "USER ID": userId,
            "DEVICE ID": DEVICE_ID
        }
        let messageExtras = {
            "lang": "en"
        }

        let options = {
            userId: userId,
            name : Name,
            additionalInfo: additionalInfo,
            messageExtras : messageExtras,
            channelId: CHANNEL_ID
        }

        widget.initiateChat(options)
            .then(data => {
                //console.log(data)
            })
            .catch(e => {
                console.log('error login', e);
            });
    }

    return (<View style={{
            flex: 1,
            marginTop: 20,
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center'
        }}>
            <Button
                onPress={() => {
                    initChat(USER_ID_1, NAME_1);
                    onPress(false)
                }}
                title={`Init Chat ${NAME_1}`}
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />

            <Button
                onPress={() => {
                    initChat(USER_ID_2, NAME_2);
                    onPress(false)
                }}
                title={`Init Chat ${NAME_2}`}
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />

            <Button
                onPress={() => {
                    widget.changeLanguage('en')
                }}
                title={`Lang end`}
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />

            <Button
                onPress={() => {
                    widget.changeLanguage('id')
                }}
                title={`Lang ID`}
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />
        </View>
    )
}

function App() {
    const [inHome, setInHome] = useState(true)
    return (
        <MultichannelWidgetProvider>
            {inHome ? <Home onPress={setInHome}/> : <ChatRoom onBack={()=> setInHome(true)} />}
        </MultichannelWidgetProvider>
    );
}

export default App;
