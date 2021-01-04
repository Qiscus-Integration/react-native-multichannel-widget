import React from "react";
import {Image, View} from "react-native";
import styles from "./styles";

const AttachmentButton = () => {
    return (
        <View>
            <Image source={require("../../../assets/ic_plus.png")} style={styles.image}/>
        </View>
    )
}

export default AttachmentButton
