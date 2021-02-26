import {Image, TouchableOpacity, View} from "react-native";
import Loading from "../Loading";
import React from "react";
import Widget from "../../../contexts/WidgetContext";
import {MessageType} from "../../../constants/messageType";
import styles from "./styles";
import {isImageFile} from "../../../utils";
import ImageProgress from 'react-native-image-progress';
import MessageAttachment from "../MessageAttachment/Index";

const ImagePreview = props => {
    const {onCloseAttachmentPreview} = props
    const {state} = Widget()
    const {attachment, progressUploading} = state

    if (attachment.type != MessageType.IMAGE) return null
    const getPreview = () => {
        if (attachment?.payload?.url) {
            const {url, file_name} = attachment?.payload
            if(isImageFile(file_name)){
                return <ImageProgress source={{uri: attachment.value}} style={styles.image}/>
            }else{
                return <MessageAttachment item={{
                    payload: attachment?.payload,
                    type: MessageType.ATTACHMENT
                }} hideDownloadButton={true}/>
            }
        }
        return (
            <View style={styles.image}/>
        )
    }
    return (<View style={[styles.container,{
        width: (!isImageFile(attachment.value) & (attachment?.payload?.url !== undefined)) ? 190 : 70,
        height: (!isImageFile(attachment.value) & (attachment?.payload?.url !== undefined)) ? 50 : 70
    }]}>
        {getPreview()}
        {(progressUploading === -1 || attachment?.payload?.url) && <TouchableOpacity onPress={() => {
            if (onCloseAttachmentPreview) onCloseAttachmentPreview()
        }} style={styles.btnClose}>
            <Image
                source={require('../../../assets/ic_close_attachment.png')}
                style={styles.imageBtnClose}/>
        </TouchableOpacity>}
        <View style={styles.loading}>
            {!attachment?.payload?.url && <Loading {...props}/>}
        </View>
    </View>)
}

export default ImagePreview
