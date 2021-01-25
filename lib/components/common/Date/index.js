import React from "react";
import {Text, View} from "react-native";
import {getMoment as moment} from "../../../utils";
import styles from "./styles";

const Date = (props) => {
    const {item, beforeItem} = props
    let currentTime = moment(item.timestamp).startOf('day').unix()
    let beforeTime = (beforeItem) ? moment( beforeItem?.timestamp).startOf('day').unix() : null
    if(currentTime === beforeTime) return null
    let date = moment(item.timestamp).calendar(null,{
        lastDay : '[Yesterday]',
        sameDay : '[Today]',
        nextDay : '[Tomorrow]',
        lastWeek : 'll',
        nextWeek : 'll',
        sameElse : 'll'
    })

    return (
        <View style={{
            alignItems:'center',
            flexDirection:'column'
        }}>
            <Text style={styles.text}>{date}</Text>
        </View>
    )
}

export default Date
