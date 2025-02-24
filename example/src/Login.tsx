import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type IProps = {
  onLogin: (username: string, password: string) => void;
};

export function Login(props: IProps) {
  const [username, setUsername] = useState('guest-1001');
  const [displayName, setDisplayName] = useState('Guest 1001');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        defaultValue={username}
        onChangeText={(value) => {
          setUsername(value);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Display Name"
        defaultValue={displayName}
        onChangeText={(value) => {
          setDisplayName(value);
        }}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          props.onLogin(username, displayName);
        }}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '80%',
    borderRadius: 3,
    marginVertical: 2,
  },
  button: {
    backgroundColor: '#ccc',
    padding: 10,
    marginTop: 10,
    width: '80%',
    borderRadius: 3,
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
  },
});
