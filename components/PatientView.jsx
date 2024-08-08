import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import styles from '../assets/styles/styles';

const PatientView = ({ user }) => {
  const qrValue = `${user.nic}`;
  return (
    <View style={styles.inner}>
      <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
      <Text style={styles.subText}>Here's your EMU QR Code:</Text>
      <View style={styles.qrContainer}>
        <QRCode
          value={qrValue}
          size={300}
          color="black"
          backgroundColor="white"
        />
      </View>
      <Text style={styles.idText}>ID: {qrValue}</Text>
    </View>
  );
};

export default PatientView;