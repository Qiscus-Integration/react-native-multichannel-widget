import {Text} from "react-native";
import React from "react";
import {MessageType} from "../../../constants/messageType";
import {parseHtmlText} from "../../../utils";
import Hyperlink from 'react-native-hyperlink'
import * as Qiscus from '../../../services/qiscus';
import {CONFIG} from '../../../constants/theme';

const MessageText = (props) => {
    const {item} = props
    const isMyText = item.email === Qiscus.currentUser().email
    if (item.type !== MessageType.TEXT) return null
    return (
        <Hyperlink linkStyle={{color: '#2980b9', textDecorationLine: 'underline'}}
                   linkDefault={true}>
            <Text
                style={{
                    padding: 2,
                    fontSize: 16,
                    color: isMyText ? CONFIG.colorMyText : CONFIG.colorOpponentText
                }}>{parseHtmlText(item.message)}</Text>
        </Hyperlink>
    )
}

export default MessageText
