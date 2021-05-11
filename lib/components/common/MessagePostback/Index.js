import {Text} from "react-native";
import React from "react";
import {MessageType} from "../../../constants/messageType";
import {parseHtmlText} from "../../../utils";
import Hyperlink from 'react-native-hyperlink'
import * as Qiscus from '../../../services/qiscus';
import {CONFIG} from '../../../constants/theme';

const MessagePostback = (props) => {
    const {item} = props
    const isMyText = item.email === Qiscus.currentUser().email
    if (item.type !== MessageType.BUTTON_POSTBACK_RESPONSE) return null
    return (
        <Hyperlink linkStyle={{color: '#2980b9', textDecorationLine: 'underline'}}
                   linkDefault={true}>
            <Text
                style={{
                    padding: 2,
                    color: isMyText ? CONFIG.colorMyText : CONFIG.colorOpponentText
                }}>{parseHtmlText(item.message)}</Text>
        </Hyperlink>
    )
}

export default MessagePostback
