import React, {useEffect} from 'react';
import {Animated, Keyboard, Platform, View} from 'react-native';

const ScreenWrapper = ({children}) => {
    const keyboardHeight = new Animated.Value(0);
    const keyboardWillShow = (event) => {
        Animated.parallel([
            Animated.timing(keyboardHeight, {
                duration: event.duration,
                toValue: event.endCoordinates.height,
                useNativeDriver:false
            })
        ]).start();
    };

    const keyboardWillHide = (event) => {
        Animated.parallel([
            Animated.timing(keyboardHeight, {
                duration: event.duration,
                toValue: 0,
                useNativeDriver:false
            }),
        ]).start();
    };

    useEffect(() => {
        if(Platform.OS !== 'ios') return
        const keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', keyboardWillShow);
        const keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', keyboardWillHide);
        return (() => {
            if(Platform.OS !== 'ios') return
            keyboardWillShowSub.remove();
            keyboardWillHideSub.remove();
        })
    })

    return (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
            {
                Platform.OS === 'ios'
                    ? (
                        <Animated.View style={{flex: 1, paddingBottom: keyboardHeight}}>
                            {children}
                        </Animated.View>
                    )
                    : (
                        <>
                            {children}
                        </>
                    )
            }
        </View>
    );
};

export default ScreenWrapper;
