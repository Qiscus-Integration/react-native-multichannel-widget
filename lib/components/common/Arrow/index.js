import React from "react";
import {Image, TouchableOpacity} from "react-native";

const Arrow = (props) => {
    const {style, onPress} = props
    return (
        <TouchableOpacity onPress={() => onPress()}>
            <Image source={require("../../../assets/ic_arrow.png")} style={{...style}}/>
        </TouchableOpacity>
    )
}

export default Arrow
