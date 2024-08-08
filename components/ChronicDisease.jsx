import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles from '../assets/styles/formStyle';
import DateTimePicker from '@react-native-community/datetimepicker';

const ChronicDiseaseForm = ({ userData, onSubmitSuccess, onClose, existingDisease = null }) => {
    const [disease, setDisease] = useState(existingDisease ? existingDisease.chronic_disease : '');
    const [diagnosedDate, setDiagnosedDate] = useState(existingDisease ? new Date(existingDisease.diagnosed_date) : new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const isUpdating = !!existingDisease;

    const handleSubmit = async () => {
        if (disease) {
            try {
                const userRef = doc(db, 'healthInfo', userData.nic);
                const newData = {
                    chronic_disease: disease,
                    diagnosed_date: diagnosedDate.toISOString().split('T')[0],
                    id: isUpdating ? existingDisease.id : Date.now().toString()
                };

                if (isUpdating) {
                    await updateDoc(userRef, {
                        chronicDiseases: arrayRemove(existingDisease)
                    });
                    await updateDoc(userRef, {
                        chronicDiseases: arrayUnion(newData)
                    });
                } else {
                    await updateDoc(userRef, {
                        chronicDiseases: arrayUnion(newData)
                    });
                }

                onSubmitSuccess();
                onClose();
            } catch (error) {
                console.error('Error managing chronic disease:', error);
                Alert.alert('Error', `Failed to ${isUpdating ? 'update' : 'add'} chronic disease`);
            }
        } else {
            Alert.alert('Validation Error', 'Please enter the disease name.');
        }
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || diagnosedDate;
        setShowDatePicker(false);
        setDiagnosedDate(currentDate);
    };

    return (
        <View style={styles.formContainer}>
            <Text style={styles.label}>Chronic Disease Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter disease name"
                value={disease}
                onChangeText={setDisease}
            />

            <Text style={styles.label}>Diagnosed Date</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                <Text>{diagnosedDate.toISOString().split('T')[0]}</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={diagnosedDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>
                    {isUpdating ? "Update Chronic Disease" : "Add Chronic Disease"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ChronicDiseaseForm;