import {Platform, StyleSheet} from "react-native";

const styles = StyleSheet.create({
    container: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginBottom: 5
    },
    containerInput: {
        padding: 10,
        paddingBottom: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    borderInput: {
        flex: 1,
        borderWidth: 1,
        padding: (Platform.OS === 'android') ? 0 : 10,
        paddingBottom: (Platform.OS === 'android') ? 0 : 14,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        maxHeight:(Platform.OS === 'android') ? 90 : 100,
    },
    textInput: {paddingLeft: 10, flex: 1},
    buttonAttachment: {
        marginRight: 10,
        flex: 0,
        marginTop:(Platform.OS === 'android') ? 0 : 4
    }
})

export default styles
