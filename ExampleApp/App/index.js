import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList} from '@react-navigation/drawer';
import ChatScreen from './screens/ChatScreen';
import {Provider} from 'react-native-paper';
import Widget, {MultichannelWidgetProvider, Qiscus} from '@qiscus-community/react-native-multichannel-widget';
import LoginScreen from './screens/LoginScreen';
import {Text, View} from 'react-native';
import ChatButtonOverlay from './common/ChatButtonOverlay';
import HomeScreen from './screens/HomeScreen';
import {HEADER_BACKGROUND, HEADER_TEXT_COLOR} from './config';
import VideoPlayer from './screens/VideoPlayer';
import {APP_ID} from "react-native-dotenv"

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const headerOption = {
    headerShown: true,
    headerStyle: {backgroundColor: HEADER_BACKGROUND},
    headerTintColor: HEADER_TEXT_COLOR
}

Qiscus.setup(APP_ID)

function ScreenSample({route, navigation}) {
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>{route.name} Screen</Text>
        </View>
    );
}


function HomeScreenDrawer(props) {
    let widget = Widget();
    return (
        <ChatButtonOverlay>
            <Drawer.Navigator
                initialRouteName="Home"
                drawerContent={props => {
                    return (
                        <DrawerContentScrollView {...props}>
                            <DrawerItemList {...props} />
                            <DrawerItem label="Indonesia" onPress={() => {
                                widget.changeLanguage("id")
                                props.navigation.closeDrawer()
                            }}/>
                            <DrawerItem label="Inggris" onPress={() => {
                                widget.changeLanguage("en")
                                props.navigation.closeDrawer()
                            }}/>
                        </DrawerContentScrollView>
                    )
                }}>
                <Drawer.Screen name="Home" component={HomeScreen} options={headerOption}/>
                <Drawer.Screen name="Screen1" component={ScreenSample} options={headerOption}/>
                <Drawer.Screen name="Screen2" component={ScreenSample} options={headerOption}/>
            </Drawer.Navigator>
        </ChatButtonOverlay>
    );
}

function MainStackScreen() {
    return (
        <MainStack.Navigator mode="modal">
            <MainStack.Screen name="Login" component={LoginScreen} options={headerOption}/>
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
            <MainStack.Screen name="VideoPlayer" component={VideoPlayer} options={{headerShown: false}}/>
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
