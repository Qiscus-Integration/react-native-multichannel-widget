import {Image, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Widget from '@qiscus-integration/react-native-multichannel-widget';

const ChatButtonOverlay = ({children}) => {
  const navigation = useNavigation();
  const {unReadCount} = Widget().state;
  return (
    <View style={{flex: 1}}>
      {children}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Chat');
        }}
        style={{
          position: 'absolute',
          bottom: 10,
          right: 20,
        }}>
        <Image
          style={{
            width: 75,
            height: 75,
          }}
          source={unReadCount > 0 ? require('../images/cs-new-message.png') : require('../images/cs.png')}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ChatButtonOverlay;
