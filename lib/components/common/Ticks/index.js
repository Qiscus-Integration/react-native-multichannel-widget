import {Image, StyleSheet, View} from "react-native";
import React from "react";
import * as Qiscus from "../../../services/qiscus";

const Ticks = props => {
    const {item} = props
    const {status} = item
    if (item.email !== Qiscus.currentUser().email) return null
    return (
        <View style={{
            marginRight: 5,
            flexDirection: "row",
            marginBottom: 5
        }}>
            {(status =="sent") && <Image source={require("../../../assets/ic_check_sent.png")} style={style.image}/>}
            {(status == "delivered") &&  <Image source={require("../../../assets/ic_check_delivered.png")} style={style.image}/>}
            {(status =="read") && <Image source={require("../../../assets/ic_check_read.png")} style={style.image}/>}
            {(status =="pending") && <Image source={require("../../../assets/ic_pending.png")} style={style.image}/>}
        </View>
    )
}

const style = StyleSheet.create({
    image: {height: 15, width: 15, marginRight: 3}
})

export default Ticks
