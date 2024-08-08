import React from 'react';
import ProfileComponent from "../components/ProfileComponent";

const ProfileScreen = ({ route }) => {
    const { userData } = route.params || {};
    console.log("HomeScreen userData:", userData);
    return (
        <ProfileComponent route={route} />
    );
};

export default ProfileScreen;