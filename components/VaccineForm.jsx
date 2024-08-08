import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles from '../assets/styles/formStyle';
import DateTimePicker from '@react-native-community/datetimepicker';

const VaccineForm = ({ userData, onSubmitSuccess, onClose, existingVaccine = null }) => {
    const [vaccineName, setVaccineName] = useState(existingVaccine ? existingVaccine.vaccine_name : '');
    const [vaccineDate, setVaccineDate] = useState(existingVaccine ? new Date(existingVaccine.vaccine_date) : new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const isUpdating = !!existingVaccine;

    const handleSubmit = async () => {
        if (vaccineName) {
            try {
                const userRef = doc(db, 'healthInfo', userData.nic);
                const newData = {
                    vaccine_name: vaccineName,
                    vaccine_date: vaccineDate.toISOString().split('T')[0],
                    id: isUpdating ? existingVaccine.id : Date.now().toString()
                };

                if (isUpdating) {
                    await updateDoc(userRef, {
                        vaccines: arrayRemove(existingVaccine)
                    });
                    await updateDoc(userRef, {
                        vaccines: arrayUnion(newData)
                    });
                } else {
                    await updateDoc(userRef, {
                        vaccines: arrayUnion(newData)
                    });
                }

                onSubmitSuccess();
                onClose();
            } catch (error) {
                console.error('Error managing vaccine:', error);
                Alert.alert('Error', `Failed to ${isUpdating ? 'update' : 'add'} vaccine`);
            }
        } else {
            Alert.alert('Validation Error', 'Please enter the vaccine name.');
        }
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || vaccineDate;
        setShowDatePicker(false);
        setVaccineDate(currentDate);
    };

    return (
        <View style={styles.formContainer}>
            <Text style={styles.label}>Vaccine Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter vaccine name"
                value={vaccineName}
                onChangeText={setVaccineName}
            />

            <Text style={styles.label}>Vaccination Date</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                <Text>{vaccineDate.toISOString().split('T')[0]}</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={vaccineDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>
                    {isUpdating ? "Update Vaccine" : "Add Vaccine"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default VaccineForm;