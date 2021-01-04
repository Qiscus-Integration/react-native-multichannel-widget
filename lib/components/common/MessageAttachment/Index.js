import {Image, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {MessageType} from "../../../constants/messageType";
import {isImageFile} from "../../../utils";
import MessageText from "../MessageText/Index";
import styles from "./styles";

const MessageAttachment = (props) => {
    const {item, index, onDownload, hideDownloadButton, hideCaption} = props
    if (item.type !== MessageType.ATTACHMENT) return null
    const {url, caption, file_name} = item.payload
    if (isImageFile(url)) return null
    return (
        <>
            <View style={styles.content}>
                <Image
                    source={require("../../../assets/ic_file_attachment.png")}
                    style={styles.icon}
                />
                <Text  numberOfLines={1} style={{ width: 150 }}>{file_name}</Text>
                {(!hideDownloadButton) && <TouchableOpacity onPress={()=>{
                    if(onDownload) onDownload(url, file_name)
                }}>
                    <Image
                        source={require("../../../assets/ic_download.png")}
                        style={styles.download}
                    />
                </TouchableOpacity>}
            </View>
            {(caption !== "" && !hideCaption) && <MessageText item={{type: MessageType.TEXT, message: caption}} index={0}/>}
        </>
    )
}

export default MessageAttachment
