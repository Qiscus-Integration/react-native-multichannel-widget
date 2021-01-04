//GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
import React, {useEffect, useState} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import Header from "./lib/components/common/Header";
import * as ImagePicker from 'expo-image-picker';
import Widget, {MultichannelWidgetProvider, MultichannelWidget} from "./lib"
import {getFileExtension, getUrlFileName} from "./lib/utils";

function Sample() {
    const widget = Widget()
    const AppId = "ADD APP ID QISCUS MULTICHANNEL HERE"

    //set user for development
    const userId = ''
    const name = ''
    const deviceId = ''

    useEffect(() => {
        widget.setup(AppId, {
            //title: 'selamat datang',
            //subtitle: 'ready to serve',
            //avatar : 'https://avatars0.githubusercontent.com/u/3271668?s=60&u=5f4d6d9ce12f2aa0ffbaf4a9c9428ccd00f8b0ef&v=4'
        });

        widget.initiateChat(userId, name, deviceId)
            .then(data => {
                //console.log(data)
            })
            .catch(e => {
                console.log("error login", e)
            })

    }, [])


    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const {status} = await ImagePicker.requestCameraRollPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const pickImage = async () => {

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
                        size: 1000
                    };
                    resolve(source);
                }
            }).catch(e => {
                reject('ImagePicker Error: ', e);
            })


        });
    };

    return (
        <View style={styles.container}>
            <Header
                height={56}
                onBackPress={() => {
                }}/>

            <MultichannelWidget
                onSuccessGetRoom={room => {
                    // console.log(room)
                }}
                onDownload={(url, fileName) => {
                    Linking.openURL(url)
                }}
                onPressSendAttachment={pickImage}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        paddingBottom: 10,
        padding: 10
    },
});

function App() {
    return (
        <MultichannelWidgetProvider>
            <Sample/>
        </MultichannelWidgetProvider>
    )
}

export default App
