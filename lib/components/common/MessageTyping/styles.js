import {StyleSheet} from "react-native";
import {CONFIG} from '../../../constants/theme';

const styles = StyleSheet.create({
  indicator: {
    padding: 10,
    width: 25,
  },
  container: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,

    marginTop: 3,
    marginBottom: 3,
    marginLeft: 10,
    backgroundColor: CONFIG.backgroundBubbleLeft,
    width: 70
  },
});

export default styles
