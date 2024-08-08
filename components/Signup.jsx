import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image, Alert,
} from 'react-native';
import {Dropdown} from "react-native-element-dropdown"
import * as ImagePicker from 'expo-image-picker';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import styles from '../assets/styles/signup';
import { db, storage,auth } from '../firebaseConfig';
import { collection, addDoc,query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { LinearGradient } from 'expo-linear-gradient';
import {useNavigation} from "@react-navigation/native";


const renderItem = (item, selectedBloodGroup) => {
    return (
        <View style={styles.item}>
            <Text style={styles.textItem}>{item.label}</Text>
            {item.value === selectedBloodGroup && (
                <AntDesign style={styles.icon} color="white" name="Safety" size={20} />
            )}
        </View>
    );
};



const PatientForm = ({
                         email, setEmail,
                         password, setPassword,
                         confirmPassword, setConfirmPassword,
                         birthDate, setBirthDate,
                         showDatePicker, hideDatePicker, isVisible,
                         nic, setNic,
                         selectedBloodGroup, setSelectedBloodGroup,
                         height, setHeight,
                         weight, setWeight,
                         name,setName,
                         bloodGroups
                     }) => {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
                <Text style={styles.datePickerText}>
                    {birthDate ? birthDate.toDateString() : 'Select Date'}
                </Text>
            </TouchableOpacity>
            <DateTimePickerModal
                isVisible={isVisible}
                mode="date"
                onConfirm={(date) => { setBirthDate(date); hideDatePicker(); }}
                onCancel={hideDatePicker}
            />
            <TextInput
                style={styles.input}
                placeholder="NIC"
                value={nic}
                onChangeText={setNic}
            />
            <Dropdown
                style={styles.input}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={bloodGroups}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select Blood Group"
                searchPlaceholder="Search..."
                value={selectedBloodGroup}
                onChange={item => {
                    setSelectedBloodGroup(item.value);
                }}
                renderLeftIcon={() => (
                    <AntDesign style={styles.icon} color="#A7A7A7" name="Safety" size={20} />
                )}
                renderItem={(item) => renderItem(item, selectedBloodGroup)}
            />
            <TextInput
                style={styles.input}
                placeholder="Height"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Weight"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
            />
        </View>
    );
};


const DoctorForm = ({
                        email, setEmail,
                        password, setPassword,
                        name,setName,
                        confirmPassword, setConfirmPassword,
                        licenseNumber, setLicenseNumber,
                        specialization, setSpecialization
                    }) => (
    <View style={styles.inputContainer}>
        <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
        />
        <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            keyboardType="email-address"
        />
        <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
        />
        <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
        />
        <TextInput
            style={styles.input}
            placeholder="License Number"
            value={licenseNumber}
            onChangeText={setLicenseNumber}
        />
        <TextInput
            style={styles.input}
            placeholder="Specialization"
            value={specialization}
            onChangeText={setSpecialization}
        />
    </View>
);

const Signup = () => {


    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [nic, setNic] = useState('');
    const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [birthDate, setBirthDate] = useState(null);
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [image, setImage] = useState(null);

    const bloodGroups = [
        { label: 'A+', value: 'A+' },
        { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' },
        { label: 'B-', value: 'B-' },
        { label: 'AB+', value: 'AB+' },
        { label: 'AB-', value: 'AB-' },
        { label: 'O+', value: 'O+' },
        { label: 'O-', value: 'O-' },
    ];

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.uri);
        }
    };

    const uploadImage = async () => {
        if (!image) return null;

        const response = await fetch(image);
        const blob = await response.blob();
        const filename = image.substring(image.lastIndexOf('/') + 1);
        const storageRef = ref(storage, `profile_images/${filename}`);

        try {
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        } catch (error) {
            console.error("Error uploading image: ", error);
            return null;
        }
    };

    const showDatePicker = () => {
        setIsVisible(true);
    };

    const hideDatePicker = () => {
        setIsVisible(false);
    };

    const RoleSelection = () => (
        <View style={styles.roleContainer}>
            <Text style={styles.roleText}>Select your role:</Text>
            <TouchableOpacity style={styles.roleButton} onPress={() => setUserRole('patient')}>
                <Text>Patient</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.roleButton} onPress={() => setUserRole('doctor')}>
                <Text>Doctor</Text>
            </TouchableOpacity>
        </View>
    );

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            console.log('Passwords do not match');
            return;
        }
        try {
            let existingUser;
            if (userRole === 'doctor') {
                const q = query(collection(db, "users"), where("licenseNumber", "==", licenseNumber));
                const querySnapshot = await getDocs(q);
                existingUser = !querySnapshot.empty;
            } else if (userRole === 'patient') {
                const q = query(collection(db, "users"), where("nic", "==", nic));
                const querySnapshot = await getDocs(q);
                existingUser = !querySnapshot.empty;
            }

            if (existingUser) {
                Alert.alert(userRole === 'doctor' ? 'License number already exists' : 'NIC already exists');
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const imageUrl = await uploadImage();
            let userData = {
                name,
                email,
                userRole,
                profileImage: imageUrl,
            };
            if (userRole === 'patient') {
                userData = {
                    ...userData,
                    nic,
                    bloodGroup: selectedBloodGroup,
                    birthDate: birthDate ? birthDate.toISOString() : null,
                    height,
                    weight,
                };
            } else if (userRole === 'doctor') {
                userData = {
                    ...userData,
                    licenseNumber,
                    specialization,
                };
            }
            const userRef = await addDoc(collection(db, "users"), userData);
            console.log("User registered successfully with ID: ", userRef.id);
            navigation.navigate('Login');
        } catch (error) {
            console.error("Error during signup: ", error);
        }
    };

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.inner}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>Sign Up</Text>
                    </View>
                    {userRole === null ? (
                        <RoleSelection />
                    ) : (
                        <>
                            {userRole === 'patient' ? (
                                <PatientForm
                                    email={email} setEmail={setEmail}
                                    password={password} setPassword={setPassword}
                                    confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                                    birthDate={birthDate} setBirthDate={setBirthDate}
                                    showDatePicker={showDatePicker} hideDatePicker={hideDatePicker}
                                    isVisible={isVisible}
                                    nic={nic} setNic={setNic}
                                    selectedBloodGroup={selectedBloodGroup} setSelectedBloodGroup={setSelectedBloodGroup}
                                    height={height} setHeight={setHeight}
                                    weight={weight} setWeight={setWeight}
                                    name ={name} setName={setName}
                                    bloodGroups={bloodGroups}
                                />
                            ) : (
                                <DoctorForm
                                    email={email} setEmail={setEmail}
                                    password={password} setPassword={setPassword}
                                    name={name} setName={setName}
                                    confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                                    licenseNumber={licenseNumber} setLicenseNumber={setLicenseNumber}
                                    specialization={specialization} setSpecialization={setSpecialization}
                                />
                            )}
                            <TouchableOpacity style={styles.buttonContainer} onPress={handleSignup}>
                                <Text style={styles.buttonText}>Sign Up</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    <TouchableOpacity style={styles.linkContainer} onPress={() => navigation.goBack()}>
                        <Text style={styles.bottomLink}>Already have an account? Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

export default Signup;
