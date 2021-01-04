import {Image, Text, TouchableOpacity, View} from "react-native";
import React, {useEffect, useState} from "react";
import Widget from "../../../";
import {MessageType} from "../../../constants/messageType";
import {generateLinkPayload, getMetaUrl, parseHtmlText} from "../../../utils";
import {setAttachment} from "../../../contexts/actions";
import styles from "./styles";

const LinkPreview = props => {
    const [title, setTitle] = useState(null)
    const [preview, setPreview] = useState(null)
    const {state, dispatch} = Widget()
    const {attachment} = state
    useEffect(() => {
        if (attachment.type == MessageType.LINK) {
            getMetaUrl(attachment.value)
                .then(data => {
                    if (data?.data?.result?.status === "OK") {
                        const {meta} = data.data
                        dispatch(setAttachment(MessageType.LINK,
                            attachment.value,
                            generateLinkPayload(
                                attachment.value,
                                meta.title,
                                meta.image,
                                meta.description,
                                meta.site.name,
                                meta.site.favicon,
                            )))
                        setTitle(meta?.title)
                        if (meta?.image) {
                            setPreview(meta?.image)
                        } else {
                            setPreview(meta?.site?.logo)
                        }
                    } else {
                        dispatch(setAttachment(MessageType.LINK, attachment.value, generateLinkPayload(attachment.value)))
                    }
                })
                .catch(e => {
                    dispatch(setAttachment(MessageType.LINK, attachment.value, generateLinkPayload(attachment.value)))
                })

        }
        return (() => {
            setTitle(null)
            setPreview(null)
        })
    }, [])
    if (attachment.type !== MessageType.LINK) return null
    const {onCloseAttachmentPreview} = props

    return (<View style={styles.container}>
        <View style={styles.content}>
            {(preview) && <Image
                source={{uri: preview}}
                style={styles.imagePreview}
            />}
            <View style={{
                flexDirection: 'column',
                flex: 1,
            }}>
                {(title) && <Text style={styles.title}>{parseHtmlText(title)}</Text>}
                <Text style={styles.attachment}>{attachment.value}</Text>
            </View>
        </View>
        <TouchableOpacity onPress={() => {
            if (onCloseAttachmentPreview) onCloseAttachmentPreview()
        }} style={styles.closeContainer}>
            <Image
                source={require('../../../assets/ic_close_attachment.png')}
                style={styles.imageClose}/>
        </TouchableOpacity>
    </View>)
}

export default LinkPreview
