import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import {MultichannelWidgetProvider} from 'react-native-multichannel-widget';
import {Provider} from 'react-native-paper';

const Stack = createStackNavigator();

function App() {
  return (
    <MultichannelWidgetProvider>
      <Provider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen}/>
            <Stack.Screen name="Chat" component={ChatScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </MultichannelWidgetProvider>
  );
}

export default App;
