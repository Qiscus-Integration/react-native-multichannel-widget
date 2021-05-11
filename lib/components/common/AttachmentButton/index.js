import React from 'react';
import {Image, View} from 'react-native';
import styles from './styles';

const AttachmentButton = ({disabled}) => {
  if (disabled) {
    return (
      <View>
        <Image source={require('../../../assets/ic_plus_disabled.png')}
               style={styles.image}/>
      </View>
    );
  }

  return (
    <View>
      <Image source={require('../../../assets/ic_plus.png')}
             style={styles.image}/>
    </View>
  );
};

export default AttachmentButton;
