import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import ChatScreen from './screens/ChatScreen';
import {Provider} from 'react-native-paper';
import {MultichannelWidgetProvider} from '@qiscus-integration/react-native-multichannel-widget';
import LoginScreen from './screens/LoginScreen';
import {Text, View} from 'react-native';
import ChatButtonOverlay from './common/ChatButtonOverlay';
import HomeScreen from './screens/HomeScreen';

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();
const Drawer = createDrawerNavigator();

function ScreenSample({route, navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>{route.name} Screen</Text>
    </View>
  );
}


function HomeScreenDrawer() {
  return (
    <ChatButtonOverlay>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} options={{headerShown: true}}/>
        <Drawer.Screen name="Screen1" component={ScreenSample} options={{headerShown: true}}/>
        <Drawer.Screen name="Screen2" component={ScreenSample} options={{headerShown: true}}/>
      </Drawer.Navigator>
    </ChatButtonOverlay>
  );
}

function MainStackScreen() {
  return (
    <MainStack.Navigator mode="modal">
      <MainStack.Screen name="Login" component={LoginScreen}/>
      <MainStack.Screen
        name="Home"
        component={HomeScreenDrawer}
        options={{headerShown: false}}
      />
    </MainStack.Navigator>
  );
}

function RootStackScreen() {
  return (
    <RootStack.Navigator mode="modal">
      <RootStack.Screen
        name="Main"
        component={MainStackScreen}
        options={{headerShown: false}}
      />
      <MainStack.Screen name="Chat" component={ChatScreen}/>
    </RootStack.Navigator>
  );
}

function App() {
  return (
    <Provider>
      <MultichannelWidgetProvider>
        <NavigationContainer>
          <RootStackScreen/>
        </NavigationContainer>
      </MultichannelWidgetProvider>
    </Provider>
  );
}

export default App;
