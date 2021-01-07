import React, {useEffect} from 'react';
import {Linking, Platform} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Widget, {Header, MultichannelWidget} from '@qiscus-integration/react-native-multichannel-widget';

function ChatScreen({route, navigation}) {
    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <Header
                onBackPress={() => navigation.goBack()}
            />
        });
    }, [navigation]);

    const widget = Widget()
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

    const onPressSendAttachment = async () => {
        const maxWidthPhoto = 1024;
        const maxHeightPhoto = 768;

        const options = {
            title: 'Select Attachment',
            chooseFromLibraryButtonTitle: undefined,
            takePhotoButtonTitle: 'Take Photo',
            maxHeight: maxHeightPhoto,
            maxWidth: maxWidthPhoto,
            customButtons: [
                {name: 'chosePhoto', title: 'Choose Photo'},
                {name: 'choseVideo', title: 'Choose Video'},
            ],
        };

        return new Promise((resolve, reject) => {
            ImagePicker.showImagePicker(options, (response) => {
                if (response.didCancel) {
                    reject('User cancelled image picker');
                } else if (response.error) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    reject('ImagePicker Error: ', response.error);
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                } else if (response.customButton) {
                    if (response.customButton == 'choseVideo') {
                        const options2 = {
                            title: 'Choose Video',
                            mediaType: 'video',
                            quality: 1,
                        };
                        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                        // @ts-ignore
                        ImagePicker.launchImageLibrary(options2, (response) => {
                            if (response.didCancel) {
                                reject('User cancelled image picker');
                            } else {
                                let _fileUri = '';
                                if (Platform.OS === 'ios') {
                                    _fileUri = response.uri.replace('file:', '');
                                } else {
                                    _fileUri = response.uri;
                                }
                                RNFetchBlob.fs
                                    .stat(_fileUri)
                                    .then((result) => {
                                        const {filename, size} = result;
                                        const fileType = filename.split('.').pop();
                                        let _fileName = '';
                                        if (Platform.OS === 'ios' || filename === undefined) {
                                            _fileName = `VID-${getFileName()}${
                                                fileType ? fileType : 'MOV'
                                            }`;
                                        } else {
                                            _fileName = filename;
                                        }
                                        const source = {
                                            uri: _fileUri,
                                            name: _fileName,
                                            type: `video/${fileType}`,
                                            size: size,
                                        };
                                        resolve(source);
                                    })
                                    .catch((error) => reject(error));
                            }
                        });
                    } else {
                        const options3 = {
                            title: 'Choose Photo',
                            maxHeight: maxHeightPhoto,
                            maxWidth: maxWidthPhoto,
                            mediaType: 'photo',
                            quality: 1,
                        };
                        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                        // @ts-ignore
                        ImagePicker.launchImageLibrary(options3, (response) => {
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
                    }
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

    const onOpenLink = (url) => {
        Linking.canOpenURL(url).then((supported) => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log("Don't know how to open URI: " + url);
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

    useEffect(() => {
        widget.initiateChat(route.params.email, route.params.name, localStorage.getItem('FCM_TOKEN'))
            .then(data => {
                //console.log(data)
            })
            .catch(e => {
                console.log("error login", e)
            })

    }, [])

    return (
        <MultichannelWidget
            onSuccessGetRoom={room => {
                // console.log(room)
            }}
            onDownload={onDownload}
            onPressSendAttachment={onPressSendAttachment}
        />
    );
}

export default ChatScreen
