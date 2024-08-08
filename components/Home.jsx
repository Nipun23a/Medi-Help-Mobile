import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../assets/styles/styles';
import {useUserData} from "../userContext";
import DoctorView from './DoctorView';
import PatientView from './PatientView';

const Home = () => {

  const { userData } = useUserData();
  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      {userData.isDoctor ? (
        <DoctorView doctor={userData} />
      ) : (
        <PatientView user={userData} />
      )}
    </LinearGradient>
  );
};

export default Home;