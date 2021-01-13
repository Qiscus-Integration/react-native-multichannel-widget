import {Image, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Widget from '@qiscus-integration/react-native-multichannel-widget';

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
          backgroundColor: '#fff',
          width: 100,
          height: 100,
          paddingRight: 10,
          paddingBottom: 10,
          borderRadius: 100,
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.30,
          shadowRadius: 4.65,

          elevation: 8,
        }}>
        <Image
          style={{
            width: 75,
            height: 75,
          }}
          source={unReadCount > 0 ? require('../images/cs-new-message.png') : require('../images/cs.png')}
        />
      </TouchableOpacity>}
    </View>
  );
};

export default ChatButtonOverlay;
