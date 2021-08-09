import {StyleSheet} from "react-native";
import {CONFIG} from "../../../constants/theme";

const styles = StyleSheet.create({
    container: {
        backgroundColor: CONFIG.backgroundBubble,
        height: 70,
        width: 70,
        marginLeft: 15,
        padding: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: 60,
        height: 60
    },
    imageStyle: {
        borderRadius: 5,
    },
    btnClose: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1,
    },
    imageBtnClose: {
        backgroundColor: 'white',
        borderRadius: 10,
        height: 15,
        width: 15
    },
    loading:{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default styles
