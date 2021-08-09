import React from 'react';
import * as Qiscus from '../../../services/qiscus/index';
import MessageText from '../MessageText/Index';
import {Image, TouchableOpacity, View} from 'react-native';
import Timer from '../Timer';
import MessageImage from '../MessageImage/Index';
import MessageAttachment from '../MessageAttachment/Index';
import Date from '../Date';
import MessageLink from '../MessageLink/Index';
import MessageProduct from '../MessageProduct/Index';
import styles from './styles';
import {MessageType} from '../../../constants/messageType';
import MessageSystemEvent from '../MessageSystemEvent';
import MessageCard from '../MessageCard';
import MessageReplay from '../MessageReplay/Index';
import {CONFIG} from '../../../constants/theme';
import Widget from '../../../contexts/WidgetContext';
import MessageVideo from '../MessageVideo/Index';
import MessagePostback from "../MessagePostback/Index";
import Carousel from "../Carousel";
import MessageButton from "../MessageButton";
import Ticks from "../Ticks";


const Bubble = (props) => {
    const {item, beforeItem, avatar} = props;
    const {type, payload} = item

    if (item.id === undefined) return null;
    if (item.type === MessageType.SYSTEM_EVENT) {
        const {payload: payloadSystemEvent} = payload ? payload : {}
        const {type: typeSystemEvent} = payloadSystemEvent ? payloadSystemEvent : {}
        if (typeSystemEvent !== MessageType.SYSTEM_EVENT_SEQUENCE_QUEUE) return null
    }

    const {state} = Widget()
    const isMyMessage = item.email === Qiscus.currentUser().email;
    const showAvatar = item.type !== MessageType.SYSTEM_EVENT && !isMyMessage && item.email !== beforeItem?.email;

    const getAvatar = () => {
        if (avatar) {
            return avatar;
        }

        if (state.avatar) {
            return <Image
                style={styles.avatar}
                source={{uri: state.avatar}}
            />;
        }

        return <Image
            style={styles.avatar}
            source={require('../../../assets/defaultAvatar.png')}
        />;
    }

    return (
        <View style={styles.container}>
            <Date {...props}/>
            {item.type !== MessageType.SYSTEM_EVENT && <View style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
            }}>
                {showAvatar && getAvatar()}
                <View style={{
                    paddingLeft: !showAvatar ? styles.avatar.width + styles.avatar.marginRight : 0,
                    alignItems: isMyMessage ? 'flex-end' : 'flex-start',
                }}>
                    {type !== MessageType.CAROUSEL &&
                    type !== MessageType.CARD &&
                    type !== MessageType.BUTTON &&
                    <View style={{
                        flexDirection: 'row',
                    }}>
                        <Ticks {...props}/>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={[
                                styles.content,
                                (type === MessageType.ATTACHMENT) &&
                                {
                                    paddingLeft: 2.5,
                                    paddingRight: 2.5,
                                    paddingTop: 2.5,
                                    paddingBottom: 2.5,
                                    borderRadius: 8
                                },
                                {
                                    backgroundColor: isMyMessage ? CONFIG.backgroundBubbleRight : CONFIG.backgroundBubbleLeft,
                                }]}
                            onLongPress={() => {
                                props.openActionMessage(item);
                            }}>
                            <MessageText {...props}/>
                            <MessageImage {...props}/>
                            <MessageVideo{...props}/>
                            <MessageAttachment {...props}/>
                            <MessageLink {...props}/>
                            <MessageProduct {...props}/>
                            <MessageReplay {...props}/>
                            <MessagePostback {...props}/>
                        </TouchableOpacity>
                    </View>}
                    <Timer {...props}/>
                    {type === MessageType.CAROUSEL && <Carousel {...props}/>}
                    {type === MessageType.CARD && <MessageCard {...props}/>}
                    {type === MessageType.BUTTON && <MessageButton {...props}/>}
                </View>
            </View>}
            <MessageSystemEvent {...props}/>
        </View>
    );
};

export default Bubble;
