import {StyleSheet} from 'react-native';
import {COLORS, CONFIG} from '../../../constants/theme';

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
        backgroundColor: CONFIG.backgroundHeader
    },
    container: {
        marginTop: 0,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    content: {
        flexDirection: 'column',
        flex: 1,
        paddingRight: 10
    },
    name: {
        fontSize: 16,
        color: COLORS.blackText,
        marginRight: 16,
        marginBottom: 2.5
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
        width: 40,
        height: 40,
        borderRadius: 100,
        marginRight: 12,
    },
});

export default styles;
