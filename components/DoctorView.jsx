import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { CameraView, Camera } from "expo-camera";
import styles from "../assets/styles/styles";
import { useNavigation } from '@react-navigation/native';


const DoctorView = ({ doctor }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const navigation = useNavigation();


    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        };
        getCameraPermissions();
    }, []);

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        navigation.navigate('Health-Report', { nic: data });
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.inner}>
            <Text style={styles.welcomeText}>Welcome, Dr. {doctor.name}!</Text>
            <Text style={styles.subText}>Scan Patient's QR Code:</Text>
            <View style={styles.scannerContainer}>
                <CameraView
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr", "pdf417"],
                    }}
                    style={StyleSheet.absoluteFillObject}
                >
                    <View style={styles.overlay}>
                        <View style={styles.square} />
                    </View>
                </CameraView>
            </View>
            {scanned && (
                <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
                    <Text style={styles.buttonText}>Tap to Scan Again</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

export default DoctorView;