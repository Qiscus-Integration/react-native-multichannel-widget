import React from "react";
import {Text} from "react-native";
import {CONFIG} from "../../../constants/theme";
import {getMoment as moment} from "../../../utils";

const Timer = (props) => {
    const {item, afterItem} = props
    const getTime = (timestamp)=> {
        return moment(timestamp).calendar(null,{
            lastDay : 'HH:mm a',
            sameDay : 'HH:mm a',
            nextDay : 'HH:mm a',
            lastWeek : 'HH:mm a',
            nextWeek : 'HH:mm a',
            sameElse : 'HH:mm a'
        })
    }

    if(getTime(item.timestamp) === getTime(afterItem?.timestamp) && item.user_id === afterItem?.user_id) return null

    return (<Text style={{
        fontSize : 12,
        marginBottom: 5,
        marginTop: 6,
        color: CONFIG.colorTimer
    }}>{getTime(item.timestamp)}</Text>)
}

export default Timer
