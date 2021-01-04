import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {MessageType} from '../../../constants/messageType';
import {COLORS} from '../../../constants/theme';
import MessageAttachment from '../MessageAttachment/Index';
import {isEmpty, isImageFile} from '../../../utils';
import Image from 'react-native-image-progress';

const MessageReplay = (props) => {
  const {item, index} = props;
  if (item.type !== MessageType.REPLY) return null;
  const {message, payload} = item;
  const {replied_comment_sender_username, replied_comment_type} = payload;

  return (
    <View>
      <View style={{
        flexDirection: 'row',
        backgroundColor: COLORS.greyTextLight,
        borderRadius: 5
      }}>
        <View style={{
          backgroundColor: COLORS.yellow,
          padding: 2,
          borderTopLeftRadius: 5,
          borderBottomLeftRadius: 5,
        }}/>
        <View style={{padding: 5}}>
          {(replied_comment_type !== MessageType.UNKNOWN) && <Text
            style={{fontWeight: 'bold'}}>{replied_comment_sender_username}</Text>}
          {replayItem(payload)}
        </View>
      </View>
      <Text>{message}</Text>
    </View>
  );
};

const replayItem = payload => {
  const {replied_comment_type, replied_comment_message, replied_comment_payload} = payload;

  if (replied_comment_type === MessageType.UNKNOWN) {
    return <Text>Message has been deleted</Text>;
  }

  if (replied_comment_type === MessageType.TEXT || replied_comment_type === MessageType.REPLY) {
    return <Text numberOfLines={4} style={{color: COLORS.white}}>{replied_comment_message}</Text>;
  }

  if (replied_comment_type === MessageType.ATTACHMENT) {
    const {url, caption} = replied_comment_payload;
    const message = {
      type: MessageType.ATTACHMENT,
      payload: replied_comment_payload,
    };
    if (isImageFile(url)) {
      return <View>
        {caption !== '' && <Text style={{color: COLORS.white}}>{caption}</Text>}
        <Image
          source={{uri: url}}
          style={{height: 200, width: 200}}
          imageStyle={{borderRadius: 5}}
        />
      </View>;
    } else {
      return <MessageAttachment
        hideDownloadButton={true}
        item={message}
      />;
    }
  }

};
export default MessageReplay;
