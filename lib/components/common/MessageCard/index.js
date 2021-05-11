import {MessageType} from '../../../constants/messageType';
import {Linking, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Image from 'react-native-image-progress';
import {parseHtmlText} from '../../../utils';
import styles from './styles';
import Button from "../Button";

const MessageCard = (props) => {
    const {item} = props;
    if (item.type !== MessageType.CARD) return null;
    const {image, description, title, buttons} = item.payload;
    return (
        <View style={styles.container}>
            <Image
                source={{uri: image}}
                style={styles.image}
                imageStyle={{
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10
                }}
            />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{parseHtmlText(description)}</Text>
            <Button buttons={buttons} {...props}/>
        </View>
    );
};
export default MessageCard;
