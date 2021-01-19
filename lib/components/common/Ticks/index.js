import {Image, StyleSheet, View} from "react-native";
import React from "react";
import * as Qiscus from "../../../services/qiscus";

const Ticks = props => {
    const {
      item,
      renderTickSent,
      renderTickDelivered,
      renderTickRead,
      renderTickPending,
    } = props

    const {status} = item
    if (item.email !== Qiscus.currentUser().email) return null

    const getTickSent = ()=>{
      if(renderTickSent) return renderTickSent
      return <Image source={require("../../../assets/ic_check_sent.png")} style={style.image}/>
    }

    const getTickDelivered = ()=>{
      if(renderTickDelivered) return renderTickDelivered
      return <Image source={require("../../../assets/ic_check_delivered.png")} style={style.image}/>
    }

    const getTickRead = ()=>{
      if(renderTickRead) return renderTickRead
      return <Image source={require("../../../assets/ic_check_read.png")} style={style.image}/>
    }

    const getTickPending = ()=>{
      if(renderTickPending) return renderTickPending
      return <Image source={require("../../../assets/ic_check_pending.png")} style={style.image}/>
    }


    return (
        <View style={{
            marginRight: 5,
            flexDirection: "row",
            marginBottom: 5
        }}>
            {(status =="sent") && getTickSent()}
            {(status == "delivered") && getTickDelivered()}
            {(status =="read") && getTickRead()}
            {(status =="pending") && getTickPending()}
        </View>
    )
}

const style = StyleSheet.create({
    image: {height: 15, width: 15, marginRight: 3}
})

export default Ticks
