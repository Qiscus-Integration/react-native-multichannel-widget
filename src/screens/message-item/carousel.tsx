import * as React from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useBubbleBgColor } from '../../hooks/use-bubble-bg-color';
import { useBubbleFgColor } from '../../hooks/use-bubble-fg-color';
import { useSendMessage } from '../../hooks/use-send-message';
import type { Card, CardButton, Message } from '../../types';
import { generatePostbackMessage } from '../../utils/generate-postback-message';

type IProps = {
  item: Message;
};
export function MessageItemCarousel(props: IProps) {
  const sendMessage = useSendMessage();

  const cards: Card[] = React.useMemo(() => {
    return props.item.payload!.cards as any;
  }, [props.item]);

  const bubbleBgColor = useBubbleBgColor(props.item.sender?.id);
  const bubbleFgColor = useBubbleFgColor(props.item.sender?.id);

  const onActionButtonPress = React.useCallback(
    async (button: CardButton) => {
      switch (button.type) {
        case 'link': {
          const supported = await Linking.canOpenURL(button.payload.url);
          if (supported) Linking.openURL(button.payload.url);
          break;
        }
        case 'postback': {
          let comment = generatePostbackMessage({
            roomId: props.item.chatRoomId,
            content: button.postback_text!,
            payload: button.payload,
          });

          await sendMessage(comment);

          break;
        }
      }
    },
    [props.item?.chatRoomId, sendMessage]
  );

  return (
    <ScrollView horizontal style={styles.container}>
      {cards.map((card, index) => (
        <View
          key={index}
          style={[styles.cardContainer, { backgroundColor: bubbleBgColor }]}
        >
          <Image source={{ uri: card.image }} style={styles.cardImage} />
          <Text style={[styles.cardTitle, { color: bubbleFgColor }]}>
            {card.title}
          </Text>
          <Text style={[styles.cardDescription, { color: bubbleFgColor }]}>
            {card.description}
          </Text>
          <View style={styles.cardButtons}>
            {card.buttons.map((button, idx) => (
              <TouchableWithoutFeedback
                key={idx}
                onPress={() => onActionButtonPress(button)}
              >
                <View style={styles.cardButton}>
                  <Text style={styles.cardButtonLabel}>{button.label}</Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'lightblue',
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  cardContainer: {
    backgroundColor: 'white',
    width: 250,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  cardImage: {
    height: 200,
    width: '100%',
    borderRadius: 8,
  },
  cardTitle: {
    marginVertical: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 12,
    flex: 1,
  },
  cardButtons: {
    marginTop: 20,
  },
  cardButton: {
    marginVertical: 5,
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cardButtonLabel: {},
});
