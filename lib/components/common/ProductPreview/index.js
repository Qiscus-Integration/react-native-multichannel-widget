import {MESSAGE} from "../../../constants/theme";
import {Image, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import Widget from "../../../";
import {MessageType} from "../../../constants/messageType";
import {formatPrice, parseHtmlText} from "../../../utils";

const ProductPreview = props => {
    const {state, dispatch} = Widget()
    const {attachment} = state
    if (attachment.type !== MessageType.PRODUCT) return null
    const {id, description, image, price, title, url} = attachment?.payload
    const {onCloseAttachmentPreview} = props
    return (<View style={{
        backgroundColor: MESSAGE.backgroundBubble,
        marginLeft: 15,
        marginRight: 15,
        padding: 7,
        borderRadius: 10
    }}>
        <View style={{
            flexDirection: 'row',
        }}>
            {(image) && <Image
                source={{uri: image}}
                style={{height: 50, width: 50, borderRadius: 5, marginRight: 10}}
            />}
            <View style={{
                flexDirection: 'column',
                flex: 1,
            }}>
                {(title) && <Text>{parseHtmlText(title)}</Text>}
                <Text style={{
                    fontSize: 14,
                    marginTop: 5,
                    marginRight: 10,
                    paddingRight: 10,
                    color: MESSAGE.colorPrimary
                }}>{formatPrice(price)}</Text>
            </View>
        </View>
        <TouchableOpacity onPress={() => {
            if (onCloseAttachmentPreview) onCloseAttachmentPreview()
        }} style={{
            position: 'absolute',
            top: 5,
            right: 5,
            zIndex: 1,
        }}>
            <Image
                source={require('../../../assets/ic_close_attachment.png')}
                style={{
                    backgroundColor: 'white',
                    borderRadius: 10,
                    height: 15,
                    width: 15
                }}/>
        </TouchableOpacity>
    </View>)
}

export default ProductPreview
