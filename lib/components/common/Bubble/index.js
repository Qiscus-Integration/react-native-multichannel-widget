import React from 'react';
import * as Qiscus from '../../../services/qiscus/index';
import MessageText from '../MessageText/Index';
import {TouchableOpacity, View} from 'react-native';
import Timer from '../Timer';
import MessageImage from '../MessageImage/Index';
import MessageAttachment from '../MessageAttachment/Index';
import Date from '../Date';
import Ticks from '../Ticks';
import MessageLink from '../MessageLink/Index';
import MessageProduct from '../MessageProduct/Index';
import styles from './styles';
import {MessageType} from '../../../constants/messageType';
import MessageSystemEvent from '../MessageSystemEvent';
import PredefinedMessage from '../PredefinedMessage';
import MessageReplay from '../MessageReplay/Index';

const Bubble = (props) => {
  const {item} = props;
  if (item.id === undefined) return null;
  return (
    <View style={styles.container}>
      <Date {...props}/>
      {item.type !== MessageType.SYSTEM_EVENT && <View style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        alignSelf: (item.email === Qiscus.currentUser().email) ? 'flex-end' : 'flex-start',
      }}>
        <Ticks {...props}/>
        <TouchableOpacity activeOpacity={1} style={styles.content} onLongPress={() => {
          props.openActionMessage(item)
        }}>
          <Timer {...props}/>
          <MessageText {...props}/>
          <MessageImage {...props}/>
          <MessageAttachment {...props}/>
          <MessageLink {...props}/>
          <MessageProduct {...props}/>
          <PredefinedMessage {...props}/>
          <MessageReplay {...props}/>
        </TouchableOpacity>
      </View>}
      <MessageSystemEvent {...props}/>
    </View>
  );
};

export default Bubble;
