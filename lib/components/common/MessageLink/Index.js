import {Image, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {MessageType} from "../../../constants/messageType";
import {MESSAGE} from "../../../constants/theme";
import {parseHtmlText} from "../../../utils";
import MessageText from "../MessageText/Index";

const MessageLink = (props) => {
    const {item, index, onClickLink} = props
    if (item.type !== MessageType.CUSTOM) return null
    if (item.payload?.type !== MessageType.LINK) return null
    const {caption, type, url, meta} = item?.payload?.content
    if (!url) return null
    const {description, site, title, image} = (meta === undefined) ? {} : meta
    const {favicon, name} = (site === undefined) ? {} : site
    return (
        <View>
            <TouchableOpacity
                style={{
                    backgroundColor: MESSAGE.backgroundPreview,
                    flexDirection: 'row',
                    padding: 5,
                    borderRadius: 5,
                    marginRight: 20,
                    width: 220,
                    flex: 1
                }}
                onPress={() => {
                    if (onClickLink) onClickLink(url)
                }}
            >
                {(image != "" && image != undefined) &&
                <Image source={{uri: image}} style={{height: 50, width: 50, borderRadius: 5, marginRight: 10}}/>}
                <View style={{
                    flexDirection: 'column',
                    padding: 5,
                    flex: 1
                }}>
                    {(title != "" && title != undefined) && <Text>{parseHtmlText(title)}</Text>}
                    {(description != "" && url != description) &&
                    <Text style={{fontSize: 12, color: MESSAGE.colorTimer}}>{description}</Text>}
                    {(url != "" && url != undefined) &&
                    <Text style={{fontSize: 12, color: MESSAGE.colorTimer}}>{url}</Text>}
                </View>
            </TouchableOpacity>
            <MessageText item={{
                type: MessageType.TEXT,
                message: caption
            }} index={0}/>
        </View>
    )
}
export default MessageLink
