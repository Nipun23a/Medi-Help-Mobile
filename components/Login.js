import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchSignInMethodsForEmail, signInWithEmailAndPassword } from 'firebase/auth';
import {collection,query,where,getDocs} from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { useUserData } from '../userContext';
import { useNavigation } from '@react-navigation/native';




const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUserData } = useUserData();
    const navigation = useNavigation();

    const checkUserExists = async (email) => {
        try {
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            console.log('Sign-in methods for', email, ':', signInMethods);
            return signInMethods.length > 0;
        } catch (error) {
            console.error('Error checking user existence:', error.code, error.message);
            return false;
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password");
            return;
        }

        console.log('Attempting login with email:', email);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log('User signed in:', user.uid);

            const userRef = collection(db,'users');
            const q = query(userRef,where("email","==",email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();
                console.log("User Data: ", userData);
                setUserData({...userData, isDoctor: userData.userRole === 'doctor'});
                navigation.navigate('BottomTabNavigator', { screen: 'Home' });
            } else {
                console.error('User document not found for email:', email);
                Alert.alert("Error", "User data not found in Firestore");
            }
        } catch (error) {
            console.error('Login Error:', error.code, error.message);
            if (error.code === 'auth/invalid-credential') {
                Alert.alert('Login Failed', 'Incorrect email or password. Please try again.');
            } else {
                Alert.alert('Login Failed', `${error.code}: ${error.message}`);
            }
        }
    };


    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.inner}
            >
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>Medi Help</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#A7A7A7"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#A7A7A7"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>
                <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.linkContainer}
                    onPress={() => navigation.navigate('Signup')}
                >
                    <Text style={styles.bottomLink}>
                        Don't have an account? Sign up
                    </Text>
                </TouchableOpacity>
                <View />
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 16,
    },
    inner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logoContainer: {
        marginBottom: 40,
    },
    logoText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
    },
    inputContainer: {
        width: '100%',
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        color: '#FFF',
        marginBottom: 10,
    },
    buttonContainer: {
        backgroundColor: '#FFD700',
        paddingVertical: 12,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkContainer1: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 16,
    },
    linkContainer: {
        alignItems: 'center',
        padding: 20,
    },
    bottomLink: {
        color: '#007bff',
        textDecorationLine: 'underline',
    }
});

export default Login;