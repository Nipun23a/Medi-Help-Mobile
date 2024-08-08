import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { db } from '../firebaseConfig'; // Make sure to import your Firebase configuration
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { LinearGradient } from "expo-linear-gradient";

const PatientHealthInfo = ({ route }) => {
    const [loading, setLoading] = useState(true);
    const [healthInfo, setHealthInfo] = useState({
        allergies: [],
        chronicDiseases: [],
        vaccines: [],
        surgeries: [],
        other: []
    });
    const [patientName, setPatientName] = useState('');
    const { nic } = route.params || {}; // Assuming the QR scan result is passed as a parameter

    useEffect(() => {
        if (nic) {
            fetchPatientName(nic);
            fetchPatientHealthInfo(nic);
        } else {
            setLoading(false);
        }
    }, [nic]);

    const fetchPatientName = async (nic) => {
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('nic', '==', nic));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                setPatientName(userDoc.data().name); // assuming the name field exists
            } else {
                console.log('User document not found');
            }
        } catch (error) {
            console.error('Error fetching patient name: ', error);
        }
    };

    const fetchPatientHealthInfo = async (nic) => {
        try {
            const docRef = doc(db, 'healthInfo', nic);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setHealthInfo(docSnap.data());
            } else {
                console.log("No health information found for this patient");
            }
        } catch (error) {
            console.error("Error fetching health information: ", error);
        } finally {
            setLoading(false);
        }
    };

    const renderInfoSection = (title, data) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {data && data.length > 0 ? (
                data.map((item, index) => (
                    <View key={index} style={styles.item}>
                        {Object.entries(item).map(([key, value]) =>
                                key !== 'id' && value && (
                                    <Text key={key} style={styles.itemText}>{`${key.replace(/_/g, ' ').toUpperCase()}: ${value}`}</Text>
                                )
                        )}
                    </View>
                ))
            ) : (
                <Text style={styles.noDataText}>No data available</Text>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!nic) {
        return (
            <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']}
                style={styles.container}
            >
            <View style={styles.centeredContainer}>
                <Text style={styles.errorText}>Please scan the QR code to view patient information.</Text>
            </View>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.container}
        >

            <ScrollView style={styles.container}>
                <Text style={styles.header}>Patient Name: {patientName}</Text>
                {renderInfoSection('Allergies', healthInfo.allergies)}
                {renderInfoSection('Chronic Diseases', healthInfo.chronicDiseases)}
                {renderInfoSection('Vaccines', healthInfo.vaccines)}
                {renderInfoSection('Surgeries', healthInfo.surgeries)}
                {renderInfoSection('Other Information', healthInfo.other)}
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop:25,
        flex: 1,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#ff0000',
        textAlign: 'center',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
    },
    section: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#007AFF',
    },
    item: {
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 10,
    },
    itemText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    noDataText: {
        fontStyle: 'italic',
        color: '#666',
    },
});

export default PatientHealthInfo;
