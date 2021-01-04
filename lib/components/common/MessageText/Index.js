import {Text} from "react-native";
import React from "react";
import {MessageType} from "../../../constants/messageType";
import {parseHtmlText} from "../../../utils";
import Hyperlink from 'react-native-hyperlink'

const MessageText = (props) => {
    const {item, index, style} = props
    if (item.type !== MessageType.TEXT) return null
    return (
        <Hyperlink linkStyle={{color: '#2980b9', textDecorationLine: 'underline'}}
                   linkDefault={true}
        >
            <Text
                style={{
                    padding: 2,
                }}>{parseHtmlText(item.message)}</Text>
        </Hyperlink>
    )
}

export default MessageText
