import * as React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ChatBubble } from '../../components/chat-bubble';
import type { Card, Message } from '../../types';

type IProps = {
  item: Message;
};
export function MessageItemCarousel(props: IProps) {
  const cards: Card[] = React.useMemo(() => {
    return props.item.payload!.cards as any;
  }, [props.item]);
  return (
    <ScrollView horizontal style={styles.container}>
      {cards.map((card, index) => (
        <View key={index} style={styles.cardContainer}>
          <Image source={{ uri: card.image }} style={styles.cardImage} />
          <Text>{card.title}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightblue',
    marginVertical: 5,
  },
  cardContainer: {
    backgroundColor: 'white',
    width: 250,
    height: 350,
    padding: 10,
    marginHorizontal: 10,
  },
  cardImage: {
    height: 200,
    width: '100%',
  },
});
