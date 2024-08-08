import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles from '../assets/styles/formStyle'; // Import the styles

const AllergyForm = ({ userData, onSubmitSuccess, onClose, existingAllergy = null }) => {
    const [allergy, setAllergy] = useState(existingAllergy ? existingAllergy.allergy : '');
    const [severity, setSeverity] = useState(existingAllergy ? existingAllergy.severity : 'Mild');
    const isUpdating = !!existingAllergy;

    const handleSubmit = async () => {
        if (allergy) {
            try {
                const userRef = doc(db, 'healthInfo', userData.nic);

                if (isUpdating) {
                    await updateDoc(userRef, {
                        allergies: arrayRemove(existingAllergy)
                    });
                    await updateDoc(userRef, {
                        allergies: arrayUnion({
                            allergy,
                            severity,
                            id: existingAllergy.id
                        })
                    });
                } else {
                    await updateDoc(userRef, {
                        allergies: arrayUnion({
                            allergy,
                            severity,
                            id: Date.now().toString()
                        })
                    });
                }

                onSubmitSuccess();
                onClose();
            } catch (error) {
                console.error('Error managing allergy:', error);
                Alert.alert('Error', `Failed to ${isUpdating ? 'update' : 'add'} allergy`);
            }
        } else {
            Alert.alert('Validation Error', 'Please enter the allergy name.');
        }
    };

    return (
        <View style={styles.formContainer}>
            <Text style={styles.label}>Allergy Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter allergy name"
                value={allergy}
                onChangeText={setAllergy}
            />

            <Text style={styles.label}>Severity</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={severity}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSeverity(itemValue)}
                >
                    <Picker.Item label="Mild" value="Mild" />
                    <Picker.Item label="Moderate" value="Moderate" />
                    <Picker.Item label="Severe" value="Severe" />
                </Picker>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>
                    {isUpdating ? "Update Allergy" : "Add Allergy"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default AllergyForm;