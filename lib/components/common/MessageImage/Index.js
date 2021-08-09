import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import {MessageType} from '../../../constants/messageType';
import {isImageFile} from '../../../utils';
import MessageText from '../MessageText/Index';
import Image from 'react-native-image-progress';

const MessageImage = (props) => {
    const {item, onPressImage} = props
    if (item.type !== MessageType.ATTACHMENT) return null
    const {url, caption, file_name} = item.payload
    if (!isImageFile(url)) return null
    const images = [{
        url: url
    }]
    return (
        <View>
            <TouchableOpacity onPress={() => {
              if(onPressImage) onPressImage(images, file_name)
            }}>
                <Image
                    source={{uri: url}}
                    style={{height: 240, width: 220}}
                    imageStyle={{borderRadius:8}}
                />
            </TouchableOpacity>

            {(caption !== "") && <MessageText item={{
                type: MessageType.TEXT,
                message: caption,
                email: item.email
            }} index={0}/>}
        </View>
    )
}

export default MessageImage
