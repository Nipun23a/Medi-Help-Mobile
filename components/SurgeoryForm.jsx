import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles from '../assets/styles/formStyle';
import DateTimePicker from '@react-native-community/datetimepicker';

const SurgeryForm = ({ userData, onSubmitSuccess, onClose, existingSurgery = null }) => {
    const [surgeryType, setSurgeryType] = useState(existingSurgery ? existingSurgery.surgery_type : '');
    const [surgeryDate, setSurgeryDate] = useState(existingSurgery ? new Date(existingSurgery.surgery_date) : new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const isUpdating = !!existingSurgery;

    const handleSubmit = async () => {
        if (surgeryType) {
            try {
                const userRef = doc(db, 'healthInfo', userData.nic);
                const newData = {
                    surgery_type: surgeryType,
                    surgery_date: surgeryDate.toISOString().split('T')[0],
                    id: isUpdating ? existingSurgery.id : Date.now().toString()
                };

                if (isUpdating) {
                    await updateDoc(userRef, {
                        surgeries: arrayRemove(existingSurgery)
                    });
                    await updateDoc(userRef, {
                        surgeries: arrayUnion(newData)
                    });
                } else {
                    await updateDoc(userRef, {
                        surgeries: arrayUnion(newData)
                    });
                }

                onSubmitSuccess();
                onClose();
            } catch (error) {
                console.error('Error managing surgery:', error);
                Alert.alert('Error', `Failed to ${isUpdating ? 'update' : 'add'} surgery`);
            }
        } else {
            Alert.alert('Validation Error', 'Please enter the surgery type.');
        }
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || surgeryDate;
        setShowDatePicker(false);
        setSurgeryDate(currentDate);
    };

    return (
        <View style={styles.formContainer}>
            <Text style={styles.label}>Surgery Type</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter surgery type"
                value={surgeryType}
                onChangeText={setSurgeryType}
            />

            <Text style={styles.label}>Surgery Date</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                <Text>{surgeryDate.toISOString().split('T')[0]}</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={surgeryDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>
                    {isUpdating ? "Update Surgery" : "Add Surgery"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default SurgeryForm;