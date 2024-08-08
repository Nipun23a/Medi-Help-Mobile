import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from '@react-navigation/stack';
import {UserProvider} from "./userContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import BottomTabNavigator from "./BottomTabNavigator";


const Stack = createStackNavigator();
export default function App() {
  return (
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} options={{headerShown:false}} />
            <Stack.Screen name="Signup" component={Signup} options={{headerShown:false}} />
            <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} options={{headerShown:false}} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>

  );
}

