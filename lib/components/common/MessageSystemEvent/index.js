import React from "react";
import {Text, View} from "react-native";
import {getMoment as moment} from "../../../utils";
import styles from "./styles";
import {MessageType} from "../../../constants/messageType";

const MessageSystemEvent = (props) => {
    const {item} = props
    if (item.type !== MessageType.SYSTEM_EVENT) return null

    let time = moment(item.timestamp).calendar(null,{
        lastDay : 'HH:mm',
        sameDay : 'HH:mm',
        nextDay : 'HH:mm',
        lastWeek : 'HH:mm',
        nextWeek : 'HH:mm',
        sameElse : 'HH:mm'
    })

    return (
        <View style={{
            alignItems:'center',
            flexDirection:'column'
        }}>
            <Text style={styles.text}>{time} - {item.message}</Text>
        </View>
    )
}

export default MessageSystemEvent
