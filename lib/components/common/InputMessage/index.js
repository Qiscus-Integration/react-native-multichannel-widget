import {Platform, ScrollView, TextInput, TouchableOpacity, View} from "react-native";
import React from "react";
import SendMessage from "../SendMessage";
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
import {isEmpty} from '../../../utils';
import {DEFAULT_PLACEHOLDER} from '../../../constants/config';

const InputMessage = (props) => {
    const {state} = Widget()
    const {attachment, replayMessage} = state
    const {
      message,
      onChangeText,
      onPress,
      onPressSendAttachment,
      sendAttachment,
      renderSendAttachment,
      renderSendMessage,
      placeholder
    } = props

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
                    {(!replayMessage?.id && sendAttachment) && <TouchableOpacity style={styles.buttonAttachment} onPress={() => {
                        if (onPressSendAttachment) onPressSendAttachment()
                    }}>
                      {renderSendAttachment ? renderSendAttachment :  <AttachmentButton/> }
                    </TouchableOpacity>}
                    {(Platform.OS === 'android') ? <ScrollView>
                        <TextInput
                            style={styles.textInput}
                            value={message}
                            onChangeText={(message) => {
                                sendTyping()
                                if (onChangeText) onChangeText(message);
                            }}
                            placeholder={(isEmpty(placeholder) ? DEFAULT_PLACEHOLDER : placeholder)}
                            multiline={true}
                            scrollEnabled={true}
                        />
                    </ScrollView> : <TextInput
                            style={styles.textInput}
                            value={message}
                            onChangeText={(message) => {
                                sendTyping()
                                if (onChangeText) onChangeText(message);
                            }}
                            placeholder={(isEmpty(placeholder) ? DEFAULT_PLACEHOLDER : placeholder)}
                            multiline={true}
                            scrollEnabled={true}
                        />}
                </View>
                {(message !== '' || message !== undefined) && <View>
                    <TouchableOpacity onPress={() => {
                        if (onPress) onPress(message)
                    }}>
                      {renderSendMessage ? renderSendMessage : <SendMessage/> }
                    </TouchableOpacity>
                </View>}
            </View>
        </View>
    )
}

export default InputMessage
