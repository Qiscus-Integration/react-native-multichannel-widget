import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        width: 210,
        backgroundColor: 'white',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopRightRadius:10,
        borderTopLeftRadius:10,
    },
    image: {
        height: 125,
        width: 210,
    },
    title: {
        fontSize: 16,
        color: '#7d7d7d',
        paddingTop: 10,
        paddingLeft: 13,
        paddingRight: 13
    },
    description: {
        fontSize: 14,
        color: '#9c9c9c',
        paddingTop: 3,
        paddingBottom: 20,
        paddingLeft: 13,
        paddingRight: 13
    },
});

export default styles;
