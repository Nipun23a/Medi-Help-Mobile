import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo

// Import your screen components
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from "./screens/ProfileScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import HealthInfoLayout from "./components/HealthInfo";
import HealthInfoScreen from "./screens/HealthInfoScreen";
import PatientHealthInfo from "./components/PatientHealthInfo";
import {useUserData} from "./userContext";


const Tab = createBottomTabNavigator();

function BottomTabNavigator({route}){
    const { userData } = useUserData();
    console.log("BottomTabNavigator userData:", userData);
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'Health-Info' || route.name === 'Health-Report') {
                        iconName = focused ? 'medkit' : 'medkit-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{headerShown:false}}
            />
            {userData.isDoctor?(
                <>
                    <Tab.Screen
                        name = 'Health-Info'
                        component={HealthInfoScreen}
                        options={{
                            headerShown:false,
                            tabBarButton:() => null,
                            tabBarVisible:false,
                        }
                        }
                    />
                    <Tab.Screen
                        name = 'Health-Report'
                        component={PatientHealthInfo}
                        options={{headerShown:false}}
                    />
                </>

            ):(
                <>
                    <Tab.Screen
                        name = 'Health-Info'
                        component={HealthInfoScreen}
                        options={{headerShown:false}}
                    />
                    <Tab.Screen
                        name = 'Health-Report'
                        component={PatientHealthInfo}
                        options={{
                            headerShown:false,
                            tabBarButton:() => null,
                            tabBarVisible:false,
                        }
                        }
                    />
                </>
            )}

            <Tab.Screen
                name = 'Profile'
                component={ProfileScreen}
                options={{headerShown:false}}
            />

            <Tab.Screen
                name='EditProfile'
                component={EditProfileScreen}
                options={{
                    headerShown:false,
                    tabBarButton:() => null,
                    tabBarVisible:false,

                    }
                }
            />

        </Tab.Navigator>
    );
};

export default BottomTabNavigator;