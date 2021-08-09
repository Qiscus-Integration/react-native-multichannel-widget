import React from "react";
import {Image, StyleSheet, View} from "react-native";

const SendMessage = ({disabled}) => {
    return (
        <View style={style.container}>
            {disabled
              ? <Image source={require("../../../assets/ic_send_disabled.png")} style={style.image}/>
              : <Image source={require("../../../assets/ic_send.png")} style={style.image}/>
            }

        </View>
    )
}

const style = StyleSheet.create({
    image: {height: 20, width: 20, marginRight: 3},
    container: {padding: 5, marginLeft:10}
})

export default SendMessage
