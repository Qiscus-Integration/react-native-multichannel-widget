import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants/theme';

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#ddd',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.62,
        elevation: 2,
        backgroundColor: COLORS.white
    },
    container: {
        marginTop: 0,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        flex: 1
    },
    content: {
        flexDirection: 'column',
        flex: 1,
        paddingRight: 10
    },
    arrowIcon: {
        height: 20,
        width: 20,
        marginRight: 10,
        marginLeft: 16,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center'
    },
    name: {
        //fontFamily: FONTS.primary.bold,
        fontSize: 15,
        color: COLORS.blackText,
        marginRight: 16,
    },
    subtitle: {
        fontSize: 12,
        color: COLORS.statusTextActive,
    },
    iconStatus: {
        width: 10,
        height: 10,
        borderRadius: 100,
        marginRight: 2,
        alignSelf: 'center',
    },
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 100,
        marginRight: 5,
    },
});

export default styles;
