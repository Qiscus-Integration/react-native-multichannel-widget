import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: 1,
    backgroundColor: '#E2E8F0'
  },
  containerInput: {
    padding: 10,
    paddingBottom: 5,
    paddingTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  borderInput: {
    flex: 1,
    borderWidth: 0,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    maxHeight: (Platform.OS === 'android') ? 90 : 100,
  },
  textInput: {
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1,
  },
  buttonAttachment: {
    marginRight: 10,
    flex: 0,
    alignSelf: 'center'
  },
  placeHolder: {
    fontSize: 16
  },

});

export default styles;
