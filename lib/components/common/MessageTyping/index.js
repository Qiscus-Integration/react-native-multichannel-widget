import React from 'react';
import {TypingAnimation} from 'react-native-typing-animation';
import {View} from 'react-native';
import {CONFIG} from '../../../constants/theme';
import styles from './styles';

const MessageTyping = () => {
  return (
    <View style={styles.container}>
      <TypingAnimation
        style={styles.indicator}
        dotColor={CONFIG.backgroundBubbleRight}
        dotMargin={5}
        dotAmplitude={5}
        dotSpeed={0.15}
        dotRadius={2.5}
        dotX={12}
        dotY={6}
      />
    </View>
  );
};

export default MessageTyping;
