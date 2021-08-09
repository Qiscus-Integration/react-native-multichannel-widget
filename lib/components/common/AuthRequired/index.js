import Widget from "../../../contexts/WidgetContext";
import React from "react";
import {Text, View} from "react-native";

const AuthRequired = ({children}) => {
    const {state} = Widget()
    const {username} = state.currentUser
    if (state.loginChecked === true && username && state.roomId !== 0) return (
        <View style={{
            flex: 1,
        }}>
            {children}
        </View>
    )
    if (state.loginChecked === true && state.loginMessage) return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Text style={{color: '#f12222'}}>Failed preparing chat</Text>
        </View>
    )
    return (
        <View style={{
            flex: 1,
        }}>
        </View>
    )
}

export default AuthRequired
