import React from "react";
import {Text} from "react-native";
import {MESSAGE} from "../../../constants/theme";
import {getMoment as moment} from "../../../utils";

const Timer = (props) => {
    const {item} = props
    let date = moment(item.timestamp).calendar(null,{
        lastDay : 'HH:mm',
        sameDay : 'HH:mm',
        nextDay : 'HH:mm',
        lastWeek : 'HH:mm',
        nextWeek : 'HH:mm',
        sameElse : 'HH:mm'
    })
    return (<Text style={{
        fontSize : 12,
        marginBottom:5,
        color: MESSAGE.colorTimer
    }}>{date}</Text>)
}

export default Timer
