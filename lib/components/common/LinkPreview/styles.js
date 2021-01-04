import {StyleSheet} from "react-native";
import {MESSAGE} from "../../../constants/theme";

const styles = StyleSheet.create({
    container: {
        backgroundColor: MESSAGE.backgroundBubble,
        marginLeft: 15,
        marginRight: 15,
        padding: 7,
        borderRadius: 10
    },
    content: {flexDirection: 'row'},
    imagePreview: {height: 50, width: 50, borderRadius: 5, marginRight: 10},
    title: {flexGrow: 1},
    attachment: {
        fontSize: 12,
        marginBottom: 5,
        marginRight: 10,
        paddingRight: 10,
        color: MESSAGE.colorTimer,
    },
    closeContainer: {
        position: 'absolute',
        top: 5,
        right: 5,
        zIndex: 1,
    },
    imageClose: {
        backgroundColor: 'white',
        borderRadius: 10,
        height: 15,
        width: 15
    }

})

export default styles
