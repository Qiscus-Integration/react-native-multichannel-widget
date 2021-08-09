import {TouchableOpacity, View, Image, StyleSheet} from 'react-native';
import React from 'react';
import {MessageType} from '../../../constants/messageType';
import {isVideoFile} from '../../../utils';
import MessageText from '../MessageText/Index';
import * as Qiscus from '../../../services/qiscus';

const MessageVideo = (props) => {
  const {item, onPressVideo} = props;
  if (item.type !== MessageType.ATTACHMENT) return null;
  const {url, caption, file_name} = item.payload;
  if (!isVideoFile(url)) return null;
  const urlThumbnail = Qiscus.qiscus.getBlurryThumbnailURL(url);

  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          if (onPressVideo) onPressVideo(url, file_name);
        }}>
        <Image
          source={{uri: urlThumbnail}}
          style={styles.img}
        />
        <View style={styles.containerButton}>
          <Image
            source={require('../../../assets/media_player.png')}
            style={styles.imgMediaPlayer}
          />
        </View>
      </TouchableOpacity>

      {(caption !== '') && <MessageText item={{
        type: MessageType.TEXT,
        message: caption,
        email: item.email,
      }} index={0}/>}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerButton: {
    position: 'absolute',
    justifyContent: 'center',
    borderRadius: 60 / 2,
    backgroundColor: '#23293b',
    padding: 15,
  },
  img: {
    height: 220,
    width: 220,
    borderRadius: 5
  },
  imgMediaPlayer: {
    height: 20,
    width: 20,
    resizeMode: 'stretch',
  },

});
export default MessageVideo;
