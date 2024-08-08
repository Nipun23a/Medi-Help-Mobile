import React from 'react';
import Home from '../components/Home';
import {Text, View} from "react-native";

const HomeScreen = ({ route }) => {
    const { userData } = route.params || {};
    console.log("HomeScreen userData:", userData);
    return (
        <Home route={route} />
    );
};

export default HomeScreen;