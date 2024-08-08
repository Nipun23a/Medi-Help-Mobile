import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, FlatList, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import {doc, getDoc, deleteDoc, collection, query, where, getDocs, updateDoc, arrayRemove} from 'firebase/firestore';
import AllergyForm from "./AllergyForm";
import ChronicDiseaseForm from "./ChronicDisease";
import SurgeryForm from "./SurgeoryForm";
import VaccineForm from "./VaccineForm";
import OtherForm from "./OtherForm";
import { useUserData } from '../userContext';
import {LinearGradient} from "expo-linear-gradient";


const HealthInfoLayout = () => {
    const { userData } = useUserData();
    const [showForm, setShowForm] = useState(false);
    const [activeInfoType, setActiveInfoType] = useState(null);
    const [healthInfo, setHealthInfo] = useState({
        allergies: [],
        surgeries: [],
        vaccines: [],
        chronicDiseases: [],
        other: [],
    });
    const [selectedItem, setSelectedItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userData && userData.nic) {
            fetchHealthInfo(userData.nic);
        } else {
            setIsLoading(false);
            setError("User data is not available. Please log in again.");
        }
    }, [userData]);

    const fetchHealthInfo = async (nic) => {
        try {
            setIsLoading(true);
            const docRef = doc(db, 'healthInfo', nic);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setHealthInfo(docSnap.data());
            } else {
                console.log("No health info found for this user");
            }
        } catch (error) {
            console.error('Error fetching health information:', error);
            setError("Failed to fetch health information. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const refreshHealthInfo = () => {
        fetchHealthInfo(userData.nic);
    };

    const handleDelete = async (item, type) => {
        try {
            const userRef = doc(db, 'healthInfo', userData.nic);

            if (type === 'allergies') {
                await updateDoc(userRef, {
                    allergies: arrayRemove(item)
                });
            } else if (type === 'chronicDiseases') {
                await updateDoc(userRef, {
                    chronicDiseases: arrayRemove(item)
                });
            }else if (type === 'vaccines'){
                await updateDoc(userRef,{
                    vaccines: arrayRemove(item)
                });
            }else if (type === 'other'){
                await updateDoc(userRef, {
                    other: arrayRemove(item)
                });
            }else if (type === 'surgeries'){
                await updateDoc(userRef,{
                    surgeries: arrayRemove(item)
                });
            }

            console.log(`Attempting to delete ${type} item:`, item);

            refreshHealthInfo();
            Alert.alert('Success', `${type} deleted successfully`);
        } catch (error) {
            console.error('Error deleting item:', error.message, error.stack);
            Alert.alert('Error', 'Failed to delete item. Please try again.');
        }
    };

    const handleAddOrEdit = (type, existingItem = null) => {
        setSelectedItem(existingItem);
        setActiveInfoType(type);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setActiveInfoType(null);
        setSelectedItem(null);
    };

    const renderItem = (item, type) => (
        <View style={styles.item}>
            <View style={styles.itemContent}>
                {renderItemContent(item, type)}
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleAddOrEdit(type, item)}
                >
                    <Ionicons name="pencil-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item, type)}
                >
                    <Ionicons name="trash-outline" size={24} color="#FF0000" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderItemContent = (item, type) => {
        switch (type) {
            case 'allergies':
                return (
                    <>
                        <Text style={styles.itemTitle}>{item.allergy}</Text>
                        <Text style={styles.itemSubtitle}>Severity: {item.severity}</Text>
                    </>
                );
            case 'surgeries':
                return (
                    <>
                        <Text style={styles.itemTitle}>{item.surgery_type}</Text>
                        <Text style={styles.itemSubtitle}>Date: {item.surgery_date}</Text>
                    </>
                );
            case 'vaccines':
                return (
                    <>
                        <Text style={styles.itemTitle}>{item.vaccine_name}</Text>
                        <Text style={styles.itemSubtitle}>Date: {item.vaccine_date}</Text>
                    </>
                );
            case 'chronicDiseases':
                return (
                    <>
                        <Text style={styles.itemTitle}>{item.chronic_disease}</Text>
                        <Text style={styles.itemSubtitle}>Diagnosed: {item.diagnosed_date}</Text>
                    </>
                );
            case 'other':
                return <Text style={styles.itemTitle}>{item.other_information}</Text>;
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    const renderInfoContainer = (title, type, data) => (

        <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>{title}</Text>
            <FlatList
                data={data}
                renderItem={({ item }) => renderItem(item, type)}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>No data available</Text>}
            />
            <TouchableOpacity
                style={styles.addItemButton}
                onPress={() => handleAddOrEdit(type)}
            >
                <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
                <Text style={styles.addItemText}>Add {title}</Text>
            </TouchableOpacity>
        </View>
    );

    const renderForm = () => {
        switch (activeInfoType) {
            case 'allergies':
                return (
                    <AllergyForm
                        userData={userData}
                        onSubmitSuccess={refreshHealthInfo}
                        onClose={handleCloseForm}
                        existingAllergy={selectedItem}
                    />
                );
            case 'chronicDiseases':
                return (
                    <ChronicDiseaseForm
                        userData={userData}
                        onSubmitSuccess={refreshHealthInfo}
                        onClose={handleCloseForm}
                        existingDisease={selectedItem}
                    />
                );
            case 'surgeries':
                return (
                    <SurgeryForm
                        userData={userData}
                        onSubmitSuccess={refreshHealthInfo}
                        onClose={handleCloseForm}
                        existingSurgery={selectedItem}
                    />
                );
            case 'vaccines':
                return (
                    <VaccineForm
                        userData={userData}
                        onSubmitSuccess={refreshHealthInfo}
                        onClose={handleCloseForm}
                        existingVaccine={selectedItem}
                    />
                );
            case 'other':
                return (
                    <OtherForm
                        userData={userData}
                        onSubmitSuccess={refreshHealthInfo}
                        onClose={handleCloseForm}
                        existingInfo={selectedItem}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.container}
        >
            <View style={styles.container}>
                <FlatList
                    data={[{ key: 'content' }]}
                    renderItem={() => (
                        <>
                            {renderInfoContainer('Allergies', 'allergies', healthInfo.allergies)}
                            {renderInfoContainer('Chronic Diseases', 'chronicDiseases', healthInfo.chronicDiseases)}
                            {renderInfoContainer('Vaccines', 'vaccines', healthInfo.vaccines)}
                            {renderInfoContainer('Surgeries', 'surgeries', healthInfo.surgeries)}
                            {renderInfoContainer('Other', 'other', healthInfo.other)}
                        </>
                    )}
                    keyExtractor={(item) => item.key}
                    ListHeaderComponent={<Text style={styles.header}>Profile</Text>}
                />
                <Modal visible={showForm} animationType="slide" transparent={true}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            {renderForm()}
                        </View>
                    </View>
                </Modal>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:50
    },
    header:{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    infoContainer: {
        backgroundColor: '#FFFFFF',
        marginVertical: 10,
        marginHorizontal: 15,
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteButton: {
        marginLeft: 10,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginHorizontal: 20,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    itemSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    editButton: {
        padding: 5,
    },
    addItemButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    addItemText: {
        marginLeft: 5,
        color: '#007AFF',
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic',
        marginTop: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
});

export default HealthInfoLayout;