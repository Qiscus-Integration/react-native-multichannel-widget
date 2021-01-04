import {FlatList, StyleSheet} from 'react-native';
import {MESSAGE} from "../../../constants/theme";

const styles = StyleSheet.create({
    content : {
        backgroundColor: MESSAGE.backgroundBubble,
        padding: 10,
        borderRadius: 10,
        borderTopRightRadius: 10,
        maxWidth: 240,
    },
    container:{
        paddingTop: 5,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    }
})

export default styles
