import {Image, Text, View} from "react-native";
import styles from "./styles";
import Arrow from "../Arrow";
import React from "react";
import Widget from "../../../";
import {DEFAULT_AVATAR} from "../../../constants/config";

const HeaderCommon = (props) => {
    const {onBackPress, height} = props
    const {state} = Widget()

    return (
        <View style={[styles.shadow, {
            height: (height) ? height : 56,
            maxHeight: (height) ? height : 56,
        }]}>
            <View style={styles.container}>
                <Arrow style={styles.arrowIcon} onPress={() => {
                    if (onBackPress) onBackPress()
                }}/>
                <View style={styles.header}>
                    <Image
                        style={styles.avatar}
                        source={{uri: (state.avatar) ? state.avatar : DEFAULT_AVATAR}}
                    />
                    <View style={styles.content}>
                        <Text style={styles.name} numberOfLines={1}>
                            {state.title}
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                            {state.typingStatus ? <Text
                                style={styles.subtitle}
                                numberOfLines={1}>
                                Typing...
                            </Text> : <Text
                                style={[styles.subtitle]}
                                numberOfLines={1}>
                                {state.subtitle}
                            </Text>}
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default HeaderCommon
