import {MessageType} from '../../../constants/messageType';
import {Linking, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Image from 'react-native-image-progress';
import {parseHtmlText} from '../../../utils';
import styles from './styles';

const PredefinedMessage = (props) => {
  const {item} = props;
  if (item.type !== MessageType.CARD) return null;
  const {image, description, title, buttons} = item.payload;
  const {label, payload} = buttons[0];
  const {url} = payload;
  return (
    <View>
      <Image
        source={{uri: image}}
        style={styles.image}
        imageStyle={{borderRadius: 5}}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{parseHtmlText(description)}</Text>
      <View style={styles.line}/>
      <View style={styles.button}>
        <TouchableOpacity onPress={() => Linking.openURL(url)}>
          <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default PredefinedMessage;
