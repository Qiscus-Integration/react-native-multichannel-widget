import {Image, Text, View} from 'react-native';
import styles from './styles';
import React from 'react';
import Widget from '../../../contexts/WidgetContext';
import { useTranslation } from "react-i18next";
import en from "../../../locales/en";

const HeaderCommon = (props) => {
  const { t } = useTranslation();
  const {height, headerRight, headerLeft, style, textColor, title, subtitle, avatar} = props;
  const {state} = Widget();
  const {username} = state.currentUser;

  const getTitle = () => {
    if (title) return title;
    if(state.title === en.title) return t('title')
    return state.title;
  };

  const getSubtitle = () => {
    if (subtitle) {
      return subtitle;
    }
    return state.subtitle
  };

  const getAvatar = () => {
    if (avatar) {
      return avatar;
    }

    if(!state.loginChecked){
      return <Image
        style={styles.avatar}
        source={require('../../../assets/chat_connecting.png')}
      />;
    }
    if (state.avatar) {
      return <Image
        style={styles.avatar}
        source={{uri: state.avatar}}
      />;
    }

    return <Image
      style={styles.avatar}
      source={require('../../../assets/defaultAvatar.png')}
    />;
  };

  const getContent = () => {
    if (state.loginChecked === true && username && state.roomId !== 0) return (
      <View style={styles.content}>
        <Text style={[styles.name, (textColor) && {color: textColor}]}
              numberOfLines={1}>
          {getTitle()}
        </Text>
        <View style={{flexDirection: 'row'}}>
          {state.typingStatus ? <Text
            style={[styles.subtitle, (textColor) && {color: textColor}]}
            numberOfLines={1}>
            {t('typing')}
          </Text> : <Text
            style={[styles.subtitle, (textColor) && {color: textColor}]}
            numberOfLines={1}>
            {getSubtitle()}
          </Text>}
        </View>
      </View>
    )

    return (
      <View style={[styles.content, {
        justifyContent: 'center'
      }]}>
        <Text style={[styles.name, (textColor) && {color: textColor}]}
              numberOfLines={1}>
          {t('connecting')}
        </Text>
      </View>
    );
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
          {getContent()}
        </View>
        {(headerRight) && headerRight}
      </View>
    </View>
  );
};

export default HeaderCommon;
