import {Platform, ScrollView, TextInput, TouchableOpacity, View} from "react-native";
import React from "react";
import SendButton from "../SendButton";
import AttachmentButton from "../AttachmentButton";
import ImagePreview from "../ImagePreview";
import LinkPreview from "../LinkPreview";
import Widget from "../../../";
import {MessageType} from "../../../constants/messageType";
import ProductPreview from "../ProductPreview";
import styles from "./styles";
import debounce from "lodash.debounce";
import * as Qiscus from "../../../services/qiscus";
import ReplayPreview from '../ReplayPreview';

const InputMessage = (props) => {
    const {state, dispatch} = Widget()
    const {attachment, replayMessage} = state
    const {message, onChangeText, onPress, onPressSendAttachment, onSubmitEditing} = props
    const _onSubmitEditing = () => {
        if (onSubmitEditing) onSubmitEditing()
    };

    const sendTyping = debounce(() => {
        Qiscus.qiscus.publishTyping(1)
    }, 1000);
    return (
        <View>
            <View style={styles.container}/>
            {(attachment.type === MessageType.IMAGE) && <ImagePreview {...props}/>}
            {(attachment.type === MessageType.LINK) && <LinkPreview {...props}/>}
            {(attachment.type === MessageType.PRODUCT) && <ProductPreview {...props}/>}
           <ReplayPreview {...props}/>
            <View style={styles.containerInput}>
                <View style={styles.borderInput}>
                    {!replayMessage?.id && <TouchableOpacity style={styles.buttonAttachment} onPress={() => {
                        if (onPressSendAttachment) onPressSendAttachment()
                    }}>
                        <AttachmentButton/>
                    </TouchableOpacity>}
                    {(Platform.OS === 'android') ? <ScrollView>
                        <TextInput
                            style={styles.textInput}
                            value={message}
                            onChangeText={(message) => {
                                sendTyping()
                                if (onChangeText) onChangeText(message);
                            }}
                            placeholder={'Tulis Pesan'}
                            multiline={true}
                            scrollEnabled={true}
                            //onSubmitEditing={_onSubmitEditing}
                        />
                    </ScrollView> : <TextInput
                            style={styles.textInput}
                            value={message}
                            onChangeText={(message) => {
                                sendTyping()
                                if (onChangeText) onChangeText(message);
                            }}
                            placeholder={'Tulis Pesan'}
                            multiline={true}
                            scrollEnabled={true}
                            //onSubmitEditing={_onSubmitEditing}
                        />}
                </View>
                {(message !== '' || message !== undefined) && <View>
                    <TouchableOpacity onPress={() => {
                        if (onPress) onPress(message)
                    }}>
                        <SendButton/>
                    </TouchableOpacity>
                </View>}
            </View>
        </View>
    )
}

export default InputMessage
