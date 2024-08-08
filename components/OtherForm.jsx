import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles from '../assets/styles/formStyle';

const OtherForm = ({ userData, onSubmitSuccess, onClose, existingInfo = null }) => {
    const [information, setInformation] = useState(existingInfo ? existingInfo.other_information : '');
    const isUpdating = !!existingInfo;

    const handleSubmit = async () => {
        if (information) {
            try {
                const userRef = doc(db, 'healthInfo', userData.nic);
                const newData = {
                    other_information: information,
                    id: isUpdating ? existingInfo.id : Date.now().toString()
                };

                if (isUpdating) {
                    await updateDoc(userRef, {
                        other: arrayRemove(existingInfo)
                    });
                    await updateDoc(userRef, {
                        other: arrayUnion(newData)
                    });
                } else {
                    await updateDoc(userRef, {
                        other: arrayUnion(newData)
                    });
                }

                onSubmitSuccess();
                onClose();
            } catch (error) {
                console.error('Error managing other information:', error);
                Alert.alert('Error', `Failed to ${isUpdating ? 'update' : 'add'} information`);
            }
        } else {
            Alert.alert('Validation Error', 'Please enter some information.');
        }
    };

    return (
        <View style={styles.formContainer}>
            <Text style={styles.label}>Other Health Information</Text>
            <TextInput
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                placeholder="Enter other health information"
                value={information}
                onChangeText={setInformation}
                multiline
                numberOfLines={4}
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>
                    {isUpdating ? "Update Information" : "Add Information"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default OtherForm;