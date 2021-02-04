import {Image, Text, View} from 'react-native';
import styles from './styles';
import React from 'react';
import Widget from '../../../';
import {DEFAULT_AVATAR} from '../../../constants/config';

const HeaderCommon = (props) => {
  const {height, headerRight, headerLeft, style, textColor, title, subtitle, avatar} = props;
  const {state} = Widget();

  const getTitle = () => {
    if(title){
      return title
    }
    return state.title
  };

  const getSubtitle = () => {
    if(subtitle){
      return subtitle
    }
    return state.subtitle
  };

  const getAvatar = () => {
    if(avatar){
      return avatar
    }
   return <Image
     style={styles.avatar}
     source={{uri: (state.avatar) ? state.avatar : DEFAULT_AVATAR}}
   />
  };

  return (
    <View style={[styles.shadow, {
      height: (height) ? height : 56,
      maxHeight: (height) ? height : 56,
    }, (style) && {...style}]}>
      <View style={styles.container}>
        {(headerLeft) && headerLeft}
        <View style={styles.header}>
          {getAvatar()}
          <View style={styles.content}>
            <Text style={[styles.name,(textColor) && {color: textColor}]} numberOfLines={1}>
              {getTitle()}
            </Text>
            <View style={{flexDirection: 'row'}}>
              {state.typingStatus ? <Text
                style={[styles.subtitle,(textColor) && {color: textColor}]}
                numberOfLines={1}>
                Typing...
              </Text> : <Text
                style={[styles.subtitle,(textColor) && {color: textColor}]}
                numberOfLines={1}>
                {getSubtitle()}
              </Text>}
            </View>
          </View>
        </View>
        {(headerRight) && headerRight}
      </View>
    </View>
  );
};

export default HeaderCommon;
