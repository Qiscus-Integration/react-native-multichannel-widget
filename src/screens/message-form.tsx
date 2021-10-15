import { useAtomValue } from 'jotai/utils';
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  fieldChatBorderColorThemeAtom,
  fieldChatTextColorThemeAtom,
  sendContainerBackgroundColorThemeAtom,
  sendContainerColorThemeAtom,
} from '../state';

type MessageFormProps = {
  onTapAddAttachment: () => void;
  onSendMessage: (message: string) => void;
};

export function MessageForm(props: MessageFormProps) {
  const [text, setText] = useState<string>();

  const containerBgColor = useAtomValue(sendContainerBackgroundColorThemeAtom);
  const containerFgBorderColor = useAtomValue(fieldChatBorderColorThemeAtom);
  const containerFgColor = useAtomValue(sendContainerColorThemeAtom);
  const fieldFgColor = useAtomValue(fieldChatTextColorThemeAtom);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: containerBgColor,
          borderTopColor: containerFgBorderColor,
        },
      ]}
    >
      <TouchableOpacity onPress={props.onTapAddAttachment} style={styles.btn}>
        <Image source={require('../assets/add-attachment.png')} />
      </TouchableOpacity>
      <View
        style={[
          styles.formContainer,
          {
            borderColor: containerFgBorderColor,
            backgroundColor: containerFgColor,
          },
        ]}
      >
        <TextInput
          placeholder="Send a message..."
          value={text}
          onChange={(event) => setText(event.nativeEvent.text)}
          style={[
            styles.textInput,
            {
              // color: containerFgColor,
              color: fieldFgColor,
            },
          ]}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          if (text && text.trim().length > 0) {
            props.onSendMessage(text);
            setText('');
          }
        }}
        style={styles.btn}
      >
        <Image source={require('../assets/send-message.png')} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexBasis: 66,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',

    backgroundColor: '#FAFAFA',
    borderTopColor: '#E3E3E3',
    borderTopWidth: 1,
    minHeight: 66,
  },
  btn: {
    marginHorizontal: 10,
  },
  formContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: '#E3E3E3',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  textInput: { padding: 0 },
});
