import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";

const Button = ({buttons, btnCallback, style}) =>{
    const typeButton = 2;

    return (
        <View style={{...style}}>
            {buttons.map(button=>{
                const {label} = button
                return (
                    <TouchableOpacity
                        style={[styles.container, (typeButton === 1) && styles.containerButton1]}
                        onPress={() => {
                            if(btnCallback) btnCallback(button)
                        }}>
                        <Text style={[styles.text, (typeButton === 1) && styles.textButton1]}>{label}</Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 3,
        margin: 8,
        borderColor: '#8fbc5a',
        alignItems: 'center'
    },
    text: {
        padding: 10,
        color: '#8fbc5a',
        fontSize: 14,
        textAlign: 'center'
    },
    containerButton1: {
        backgroundColor: '#8fbc5a'
    },
    textButton1 : {
        color: 'white'
    }
})

export default Button
