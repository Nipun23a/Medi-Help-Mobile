import React from 'react';
import EditProfile from "../components/EditProfile";
import {LinearGradient} from "expo-linear-gradient";

const EditProfileScreen = ({ route }) => {
    return (
        <EditProfile route={route}/>
    );
};

export default EditProfileScreen;