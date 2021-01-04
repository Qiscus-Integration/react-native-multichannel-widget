import {Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {MessageType} from "../../../constants/messageType";
import {MESSAGE} from "../../../constants/theme";
import {formatPrice, parseHtmlText} from "../../../utils";
import MessageText from "../MessageText/Index";
import ImageView from "../ImageView";

const MessageProduct = (props) => {
    const {item, index, onClickProduct} = props
    if (item.type !== MessageType.CUSTOM) return null
    if (item.payload?.type !== MessageType.PRODUCT) return null
    const {content} = item?.payload
    const {id, image, price, title, caption, url, description} = content
    return (
        <View>
            <TouchableOpacity
                style={{
                    backgroundColor: MESSAGE.backgroundPreview,
                    flexDirection: 'column',
                    padding: 5,
                    borderRadius: 5,
                    flex: 1
                }}
                onPress={() => {
                    if (onClickProduct) onClickProduct(content)
                }}>
                {(image != "" && image != undefined) &&
                <ImageView
                    source={{uri: image}}
                    onPress={() => {
                        if (onClickProduct) onClickProduct(content)
                    }}
                    style={{height: 100, width: 100, borderRadius: 5}}
                />}

                {(title != "" && title != undefined) && <Text>{parseHtmlText(title)}</Text>}
                {(price != "" && price != undefined) && <Text style={{
                    fontSize: 14, color: MESSAGE.colorPrimary, marginTop: 5,
                }}>{formatPrice(price)}</Text>}
            </TouchableOpacity>
            {(caption != "" && caption != undefined) && <MessageText item={{
                type: MessageType.TEXT,
                message: caption
            }} index={0}/>}
        </View>
    )
}
export default MessageProduct
