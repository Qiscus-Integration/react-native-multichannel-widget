import {TouchableOpacity} from "react-native";
import React from "react";
import Image from 'react-native-image-progress';

const ImageView = (props) => {
    const {source, onPress,style} = props
    return (
            <TouchableOpacity onPress={() => {
                if(onPress) onPress()
            }}>
                <Image
                    source={source}
                    style={style}
                />
            </TouchableOpacity>
    )
}

export default ImageView
