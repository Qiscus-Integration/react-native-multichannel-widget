import React, {useEffect, useState} from 'react';
import {
    Image,
    Linking, PermissionsAndroid,
    Platform,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Widget, {
    Header,
    MultichannelWidget
} from '@qiscus-community/react-native-multichannel-widget';
import {StackActions} from '@react-navigation/native';
import {PERMISSIONS, check, request, RESULTS} from 'react-native-permissions'
import CustomStatusBar from "../common/StatusBar";
import {STATUS_BAR_BACKGROUND} from "../config";

function ChatScreen({route, navigation}) {
    const [cameraGranted, setCameraGranted] = useState(false);
    const widget = Widget();
    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <SafeAreaView style={{backgroundColor: STATUS_BAR_BACKGROUND}}>
                <Header
                    textColor={"#fff"}
                    headerLeft={(
                        <TouchableOpacity
                            style={{
                                padding: 10,
                            }}
                            onPress={() => {
                                resolve();
                                if (navigation.canGoBack()) {
                                    navigation.dispatch(StackActions.pop(1));
                                }
                            }}>
                            <Image source={require('../images/close.png')}
                                   style={styles.arrowIcon}/>
                        </TouchableOpacity>
                    )}
                    headerRight={(
                        <TouchableOpacity
                            style={{
                                padding: 10,
                            }}
                            onPress={() => {
                                if (navigation.canGoBack()) {
                                    navigation.dispatch(StackActions.pop(1));
                                }
                            }}>
                            <Image source={require('../images/mini_chat_white.png')}
                                   style={styles.miniChatIcon}/>
                        </TouchableOpacity>
                    )}
                />
            </SafeAreaView>,
        });
    }, [navigation]);

    const onOpenLink = (url) => {
        Linking.canOpenURL(url).then((supported) => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log('Don\'t know how to open URI: ' + url);
            }
        });
    };

    const onDownload = (url, fileName) => {
        if (Platform.OS === 'android') {
            const {dirs} = RNFetchBlob.fs;
            RNFetchBlob.config({
                fileCache: true,
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    mediaScannable: true,
                    title: fileName,
                    path: `${dirs.DownloadDir}/${fileName}`,
                },
            })
                .fetch('GET', url, {})
                .then((res) => {
                    //console.log('The file saved to ', res.path());
                })
                .catch((e) => {
                    //console.log(e);
                });
        } else {
            onOpenLink(url);
        }
    };

    const resolve = () => {
        widget.endSession();
    };
    const onPressSendAttachment = async () => {
        const maxWidthPhoto = 1024;
        const maxHeightPhoto = 768;

        const options = {
            maxHeight: maxHeightPhoto,
            maxWidth: maxWidthPhoto,
        };
        return new Promise((resolve, reject) => {
            ImagePicker.launchImageLibrary(options, (response) => {
                if (response.didCancel) {
                    reject('User cancelled image picker');
                } else {
                    const {fileName, uri, type, fileSize} = response;
                    let name = fileName;
                    if (!fileName) {
                        const _fileName = uri.split('/').pop();
                        const _fileType = type ? type.split('/').pop() : 'jpeg';
                        name = `${_fileName}.${_fileType}`;
                    }
                    const source = {
                        uri: uri,
                        name: name,
                        type: type,
                        size: fileSize,
                    };
                    resolve(source);
                }
            });
        });
    };

    const getFileName = () => {
        const date = new Date();
        const seconds = date.getSeconds();
        const minutes = date.getMinutes();
        const hour = date.getHours();
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        return `${year}${month}${day}-${hour}${minutes}${seconds}`;
    };

    const requestCameraPermission = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "App Camera Permission",
                        message: "App needs access to your camera",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    setCameraGranted(true)
                } else {
                    setCameraGranted(false)
                }
            } else {
                const res = await check(PERMISSIONS.IOS.CAMERA);

                if (res === RESULTS.GRANTED) {
                    setCameraGranted(true);
                } else if (res === RESULTS.DENIED) {
                    const res2 = await request(PERMISSIONS.IOS.CAMERA);
                    res2 === RESULTS.GRANTED
                        ? setCameraGranted(true)
                        : setCameraGranted(false);
                }
            }
        } catch (err) {
            console.warn(err);
        }
    };

    useEffect(() => {
        requestCameraPermission()
    }, [])
    return (
        <SafeAreaView style={{
            flex: 1,
        }}>
            <CustomStatusBar/>
            <MultichannelWidget
                sendAttachment={true}
                onSuccessGetRoom={room => {
                    // console.log(room)
                }}
                onPressVideo={(url, name) => {
                    navigation.navigate('VideoPlayer', {name, url, screen: 'Settings'});
                }}
                //filterMessage={message=> message?.payload?.payload?.type !== 'resolve_conversation'}
                onDownload={onDownload}
                onPressSendAttachment={onPressSendAttachment}
            />
        </SafeAreaView>
    );
}

export default ChatScreen;

const styles = StyleSheet.create({
    arrowIcon: {
        height: 16,
        width: 16,
        marginRight: 10,
        marginLeft: 16,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
    },
    miniChatIcon: {
        height: 20,
        width: 20,
        marginRight: 10,
        marginLeft: 16,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
