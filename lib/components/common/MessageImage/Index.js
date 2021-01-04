import {Modal, TouchableOpacity, View} from "react-native";
import React, {useState} from "react";
import {MessageType} from "../../../constants/messageType";
import {isImageFile} from "../../../utils";
import MessageText from "../MessageText/Index";
import ImageViewer from 'react-native-image-zoom-viewer';
import Image from 'react-native-image-progress';

const MessageImage = (props) => {
    const {item, onDownload} = props
    const [visibleModal, setVisibleModal] = useState(false)
    if (item.type !== MessageType.ATTACHMENT) return null
    const {url, caption, file_name} = item.payload
    if (!isImageFile(url)) return null
    const images = [{
        url: url
    }]
    return (
        <View>
            <TouchableOpacity onPress={() => setVisibleModal(true)}>
                <Image
                    source={{uri: url}}
                    style={{height: 220, width: 220}}
                    imageStyle={{borderRadius:5}}
                />
            </TouchableOpacity>

            {(caption !== "") && <MessageText item={{
                type: MessageType.TEXT,
                message: caption
            }} index={0}/>}

            <Modal
                visible={visibleModal}
                onRequestClose={() => { setVisibleModal(false); } }
                transparent={true}>
                <ImageViewer
                    imageUrls={images}
                    onSwipeDown={()=>setVisibleModal(false)}
                    enableSwipeDown={true}
                    onSave={url=>{
                      if (onDownload) onDownload(url, file_name)
                    }}
                    menuContext={{
                      saveToLocal: 'Download Image',
                      cancel: 'Cancel'
                    }}
                />
            </Modal>
        </View>
    )
}

export default MessageImage
