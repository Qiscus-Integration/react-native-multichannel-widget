import {Text} from "react-native";
import {COLORS} from "../../../constants/theme";
import {getVersion} from "../../../utils";
import React from "react";

const VersionChat = () => {
    return <Text style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        color: COLORS.greyTextLight
    }}>{getVersion()}</Text>
}

export default VersionChat
