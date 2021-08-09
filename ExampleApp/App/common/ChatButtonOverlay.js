import {Image, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Widget from '@qiscus-community/react-native-multichannel-widget';

const ChatButtonOverlay = ({children}) => {
  const navigation = useNavigation();
  const {unReadCount, roomId} = Widget().state;
  return (
    <View style={{flex: 1}}>
      {children}
      {roomId != null && <TouchableOpacity
        onPress={() => {
          navigation.navigate('Chat');
        }}
        style={{
          position: 'absolute',
          bottom: 10,
          right: 20,
          width: 100,
          height: 100,
          borderRadius: 100,
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        {unReadCount > 0 && <View style={{
          position: 'absolute',
          bottom: 60,
          right: 10,
          width: 20,
          height: 20,
          justifyContent: 'center',
          borderRadius: 60 / 2,
          backgroundColor: '#f15a22',
          zIndex: 1,
        }}>
          <Text style={{
            alignSelf: 'center',
            fontWeight: 'bold',
            color: 'white',
            fontSize: 9,
          }}>{unReadCount}</Text>
        </View>}
        <Image
          style={{
            width: 75,
            height: 75,
          }}
          source={require('../images/floating_chat_mini.png')}
        />
      </TouchableOpacity>}
    </View>
  );
};

export default ChatButtonOverlay;
