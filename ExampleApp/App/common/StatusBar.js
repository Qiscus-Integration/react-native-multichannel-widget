import React from "react";
import {StatusBar} from 'react-native'
import {STATUS_BAR_BACKGROUND} from "../config";

const CustomStatusBar = () => {
    return <StatusBar barStyle="light-content" backgroundColor={STATUS_BAR_BACKGROUND}/>
}

export default CustomStatusBar