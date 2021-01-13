import Widget from "../../../";
import React from "react";
import {ActivityIndicator, Text, View} from "react-native";

const AuthRequired = ({children}) => {
    const {state} = Widget()
    const {username} = state.currentUser
    if (state.loginChecked === true && username && state.roomId !== 0) return (
        <View style={{
            flex: 1,
            backgroundColor: '#fff'
        }}>
            {children}
        </View>
    )
    if (state.loginChecked === true && !username) return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff'
        }}>
            <Text style={{color: '#f12222'}}>Failed preparing chat</Text>
        </View>
    )
    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff'
        }}>
            <ActivityIndicator size="large" color="#475540"/>
            <Text>Chat is preparing</Text>
        </View>
    )
}

export default AuthRequired
