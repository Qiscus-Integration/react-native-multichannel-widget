import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import {Provider} from 'react-native-paper';
import {MultichannelWidgetProvider} from '@qiscus-integration/react-native-multichannel-widget';

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
