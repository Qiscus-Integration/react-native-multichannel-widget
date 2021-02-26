import {ActivityIndicator, Text, View} from "react-native";
import React from "react";
import Widget from "../../../contexts/WidgetContext";
import styles from "./styles";

const Loading = (props) => {
    const {state, dispatch} = Widget()
    const {attachment, progressUploading} = state
    const getProgress = () =>{
        if(progressUploading){
            try {
                let progress = progressUploading.toString().split('.')
                return progress[0]
            }catch (e) {
                return progressUploading
            }
        }else{
            return ''
        }
    }
    if(getProgress() == 100 || progressUploading == -1) return null
    return (
        <View {...props}>
            <ActivityIndicator size="large" color="#475540"/>
            {(getProgress() != '' && attachment.type != '') && <View style={styles.container}>
                <Text style={styles.progress}>{getProgress()}%</Text>
            </View>}
        </View>
    )
}

export default Loading
