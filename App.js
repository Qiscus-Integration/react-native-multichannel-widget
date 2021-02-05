//GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
import React, {useEffect, useState} from 'react';
import {Image, Linking, StyleSheet, View} from 'react-native';
import Header from './lib/components/common/Header';
import * as ImagePicker from 'expo-image-picker';
import Widget, {MultichannelWidgetProvider, MultichannelWidget} from './lib';
import {getFileExtension, getUrlFileName} from './lib/utils';
import Arrow from './lib/components/common/Arrow';
import {APP_ID, USER_ID, NAME, DEVICE_ID} from "react-native-dotenv"
function Sample() {
  const widget = Widget();
  useEffect(() => {
    widget.setup(APP_ID);

    widget.initiateChat(USER_ID, NAME, DEVICE_ID)
      .then(data => {
        //console.log(data)
      })
      .catch(e => {
        console.log('error login', e);
      });

  }, []);


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

          }}/>}
        style={{
          backgroundColor : 'orange'
        }}
        textColor = 'white'
      />

      <MultichannelWidget
        onSuccessGetRoom={room => {
          // console.log(room)
        }}
        onDownload={(url, fileName) => {
          Linking.openURL(url);
        }}
        onPressSendAttachment={pickImage}
        renderTickSent = {<Image source={require("./lib/assets/ic_check_sent.png")} style={styles.tick}/>}
        renderTickDelivered={<Image source={require("./lib/assets/ic_check_delivered.png")} style={styles.tick}/>}
        renderTickRead = {<Image source={require("./lib/assets/ic_check_read.png")} style={styles.tick}/>}
        renderTickPending ={<Image source={require("./lib/assets/ic_check_pending.png")} style={styles.tick}/>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 10,
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

function App() {
  return (
    <MultichannelWidgetProvider>
      <Sample/>
    </MultichannelWidgetProvider>
  );
}

export default App;
