import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Image, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { useUserData } from "../userContext";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { db, storage, auth } from '../firebaseConfig';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const EditProfileComponent = () => {
    const { userData, setUserData } = useUserData();
    const navigation = useNavigation();
    const [editedData, setEditedData] = useState({ ...userData });
    const [newImage, setNewImage] = useState(null);
    const isDoctor = userData.userRole === 'doctor';

    const handleImageUpload = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setNewImage(result.assets[0].uri);
            setEditedData({ ...editedData, profileImage: result.assets[0].uri });
        }
    };

    const handleCameraCapture = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setNewImage(result.assets[0].uri);
            setEditedData({ ...editedData, profileImage: result.assets[0].uri });
        }
    };

    const uploadImage = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const fileRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
        await uploadBytes(fileRef, blob);
        return await getDownloadURL(fileRef);
    };


    const handleSave = async () => {
        try {
            let updatedData = { ...editedData };

            if (newImage) {
                const imageUrl = await uploadImage(newImage);
                updatedData.profileImage = imageUrl;
            }

            if (!isDoctor) {
                updatedData.weight = editedData.weight;
                updatedData.height = editedData.height;
            }

            // Query to find the user document based on NIC
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where("nic", "==", userData.nic));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Document exists, update it
                const userDoc = querySnapshot.docs[0];
                await updateDoc(userDoc.ref, updatedData);
                console.log("Document updated successfully", updatedData);

                // Update local state with all fields from updatedData
                setUserData(prevData => ({
                    ...prevData,
                    ...updatedData
                }));

                Alert.alert("Success", "Profile updated successfully!");
                navigation.navigate('Profile');
            } else {
                console.log("User document not found");
                Alert.alert("Error", "User profile not found. Please contact support.");
            }
        } catch (error) {
            console.error("Error updating profile: ", error);
            Alert.alert("Error", "Failed to update profile. Please try again.");
        }
    }

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.container}
        >
            <View style={styles.container}>
                <Text style={styles.header}>Edit Profile</Text>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={editedData.profileImage ? { uri: editedData.profileImage } : require('../assets/placeholder.jpg')}
                        style={styles.profileImage}
                    />
                    <View style={styles.imageButtonContainer}>
                        <Button title="Upload Image" onPress={handleImageUpload} color="#4CAF50" />
                        <Button title="Take Photo" onPress={handleCameraCapture} color="#2196F3" />
                    </View>
                </View>
                {!isDoctor && (
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            value={editedData.weight}
                            onChangeText={(text) => setEditedData({ ...editedData, weight: text })}
                            placeholder="Weight (kg)"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            value={editedData.height}
                            onChangeText={(text) => setEditedData({ ...editedData, height: text })}
                            placeholder="Height (cm)"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                        />
                    </View>
                )}
                <View style={styles.buttonContainer}>
                    <Button title="Save" onPress={handleSave} color="#4CAF50" />
                    <Button title="Cancel" onPress={() => navigation.goBack()} color="#f44336" />
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
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    uploadText: {
        color: '#fff',
        marginTop: 10,
    },
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    imageButtonContainer:{
        flexDirection:'column',
        justifyContent:'space-around'
    }
});

export default EditProfileComponent;