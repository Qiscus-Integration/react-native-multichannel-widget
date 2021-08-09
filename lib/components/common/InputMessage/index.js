import {
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import SendMessage from '../SendMessage';
import AttachmentButton from '../AttachmentButton';
import ImagePreview from '../ImagePreview';
import Widget from '../../../contexts/WidgetContext';
import {MessageType} from '../../../constants/messageType';
import ProductPreview from '../ProductPreview';
import styles from './styles';
import debounce from 'lodash.debounce';
import * as Qiscus from '../../../services/qiscus';
import ReplayPreview from '../ReplayPreview';
import {isEmpty} from '../../../utils';
import {useTranslation} from "react-i18next";

const InputMessage = (props) => {
  const { t } = useTranslation();
  const {state} = Widget();
  const {attachment, replayMessage, currentUser} = state;
  const {username} = currentUser;
  let enableInput = state.loginChecked === true && username && state.roomId !== 0
  const inputElementRef = useRef(null)
  useEffect(() => {

    if (inputElementRef?.current) {
      inputElementRef.current.setNativeProps({
        style: styles.placeHolder
        ,
      });
    }
  }, [inputElementRef]);
  const {
    message,
    onChangeText,
    onPress,
    onPressSendAttachment,
    renderSendAttachment,
    renderSendMessage,
    placeholder,
  } = props;

  const sendTyping = debounce(() => {
    Qiscus.qiscus.publishTyping(1);
  }, 1000);

  let getPlaceHolder = () =>{
    if(!enableInput) return t('placeholderDisable')
    return isEmpty(placeholder) ? t('placeholder') : placeholder
  }
  let disableButton = !enableInput || isEmpty(message) && Object.entries(state.attachment?.payload).length === 0

  return (
    <View>
      <View style={styles.container}/>
      {(attachment.type === MessageType.IMAGE) && <ImagePreview {...props}/>}
      {(attachment.type === MessageType.PRODUCT) && <ProductPreview {...props}/>}
      <ReplayPreview {...props}/>
      <View style={styles.containerInput}>
        <View style={styles.borderInput}>
          {(!replayMessage?.id) &&
          <TouchableOpacity disabled={!enableInput} style={styles.buttonAttachment} onPress={() => {
            if (onPressSendAttachment) onPressSendAttachment();
          }}>
            {renderSendAttachment ? renderSendAttachment : <AttachmentButton disabled={!enableInput}/>}
          </TouchableOpacity>}
          {(Platform.OS === 'android') ? <ScrollView>
            <TextInput
              ref={inputElementRef}
              editable={enableInput}
              style={styles.textInput}
              value={message}
              onChangeText={(message) => {
                sendTyping();
                if (onChangeText) onChangeText(message);
              }}
              placeholder={getPlaceHolder()}
              multiline={true}
              scrollEnabled={true}
            />
          </ScrollView> : <TextInput
            ref={inputElementRef}
            editable={enableInput}
            style={styles.textInput}
            value={message}
            onChangeText={(message) => {
              sendTyping();
              if (onChangeText) onChangeText(message);
            }}
            placeholder={getPlaceHolder()}
            multiline={true}
            scrollEnabled={true}
          />}
        </View>
        {(message !== '' || message !== undefined) && <View>
          <TouchableOpacity disabled={disableButton} onPress={() => {
            if (onPress) onPress(message);
          }}>
            {renderSendMessage ? renderSendMessage :
              <SendMessage disabled={disableButton}/>}
          </TouchableOpacity>
        </View>}
      </View>
    </View>
  );
};

export default InputMessage;
