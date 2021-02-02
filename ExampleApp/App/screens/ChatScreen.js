import React, {useState} from 'react';
import {Linking, Platform, Text, TouchableOpacity, View, SafeAreaView} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Widget, {
  Header,
  MultichannelWidget,
} from '@qiscus-integration/react-native-multichannel-widget';
import {StackActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import Dialog from 'react-native-dialog';
import UserInactivity from 'react-native-user-inactivity';

function ChatScreen({route, navigation}) {
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertInactivity, setShowAlertInactivity] = useState(false);
  const [active, setActive] = useState(true);
  const widget = Widget();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <SafeAreaView>
        <Header
          headerLeft={(
            <TouchableOpacity
              style={{
                padding: 10,
              }}
              onPress={() => {
                setShowAlert(true);
              }}>
              <Icon name="close" size={22} color="#000000"/>
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
              <Icon name="circledowno" size={22} color="#000000"/>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>,
    });
  }, [navigation]);

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
          reject('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          if (response.customButton == 'choseVideo') {
            const options2 = {
              title: 'Choose Video',
              mediaType: 'video',
              quality: 1,
            };
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

  return (
    <SafeAreaView style={{
      flex: 1,
    }}>
      <UserInactivity
        skipKeyboard={true}
        isActive={active}
        timeForInactivity={30000}
        onAction={isActive => {
          setShowAlertInactivity(true)
        }}
      >
        <MultichannelWidget
          sendAttachment={false}
          onSuccessGetRoom={room => {
            // console.log(room)
          }}
          onDownload={onDownload}
          onPressSendAttachment={onPressSendAttachment}
        />
        <Dialog.Container visible={showAlert}>
          <Dialog.Title>End Chat</Dialog.Title>
          <Dialog.Description>
            Do you want to end chat.
          </Dialog.Description>
          <Dialog.Button
            label="Cancel"
            onPress={() => setShowAlert(false)}/>
          <Dialog.Button
            label="Yes"
            onPress={() => {
              widget.clearUser();
              if (navigation.canGoBack()) {
                navigation.dispatch(StackActions.pop(1));
              }
            }}/>
        </Dialog.Container>
        <Dialog.Container visible={showAlertInactivity}>
          <Dialog.Title>You are inactive</Dialog.Title>
          <Dialog.Description>
            Are you going to end this chat
          </Dialog.Description>
          <Dialog.Button
            label="Cancel"
            onPress={() => {
              setActive(true)
              setShowAlertInactivity(false)
            }}/>
          <Dialog.Button
            label="Yes"
            onPress={() => {
              widget.clearUser();
              if (navigation.canGoBack()) {
                navigation.dispatch(StackActions.pop(1));
              }
            }}/>
        </Dialog.Container>
      </UserInactivity>
    </SafeAreaView>
  );
}

export default ChatScreen;
