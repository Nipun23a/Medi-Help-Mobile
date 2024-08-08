 import React from 'react';
import {View, Text, TouchableHighlight, StyleSheet, Button,Image} from 'react-native';
import {LinearGradient} from "expo-linear-gradient";
import {useUserData} from "../userContext";
import {CommonActions, useNavigation} from "@react-navigation/native";



const ProfileComponent = () => {
    const { userData } = useUserData();
    const navigation = useNavigation();
    const {logout} = useUserData();
    if (!userData) {
        return <Text>Loading...</Text>;
    }
    const isDoctor = userData.userRole === 'doctor';

    const handleEditProfile = () => {
        navigation.navigate('EditProfile');    };

    const handleLogout = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            })
        );
    };



    return(
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.container}
        >
            <View style={styles.container}>
                <Text style={styles.header}>Profile</Text>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={userData.profileImage ? { uri: userData.profileImage } : require('../assets/placeholder.jpg')}
                        style={styles.profileImage}
                    />
                </View>
                <View style={styles.profileInformation}>
                    <View style={  styles.infoContainer}>
                        <Text style={styles.label}>Name:</Text>
                        <Text style={styles.value}>{userData.name}</Text>
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.value}>{userData.email}</Text>
                    </View>

                    {isDoctor ? (
                        <>
                            <View style={styles.infoContainer}>
                                <Text style={styles.label}>Specialization:</Text>
                                <Text style={styles.value}>{userData.specialization}</Text>
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.label}>License Number:</Text>
                                <Text style={styles.value}>{userData.licenseNumber}</Text>
                            </View>
                        </>
                    ) : (
                        <>
                            <View style={styles.infoContainer}>
                                <Text style={styles.label}>Birthdate:</Text>
                                <Text style={styles.value}>{userData.birthDate}</Text>
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.label}>Blood Group:</Text>
                                <Text style={styles.value}>{userData.bloodGroup}</Text>
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.label}>NIC:</Text>
                                <Text style={styles.value}>{userData.nic}</Text>
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.label}>Height:</Text>
                                <Text style={styles.value}>{userData.height}</Text>
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.label}>Weight:</Text>
                                <Text style={styles.value}>{userData.weight}</Text>
                            </View>


                        </>
                        )}
                </View>
                <View style = {styles.profileButtonContainer}>
                    <Button
                        title="Edit Profile"
                        onPress={handleEditProfile}
                        color="#4CAF50"
                    />
                    <Button
                        title="Logout"
                        onPress={handleLogout}
                        color="#f44336"
                    />
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        marginTop:50,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    infoContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        fontSize:16
    },
    label: {
        fontWeight: 'bold',
        width: 120,
        fontSize:16
    },
    value: {
        flex: 1,
    },
    profileButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    profileImageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0', // Background color for the container
        alignSelf: 'center', // Center the container horizontally
        marginBottom: 20, // Add some space below the image
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    profileInformation: {
        marginTop:20,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignSelf: 'center',
        width: '100%',
        maxWidth: 400,
    },


});
export default ProfileComponent;