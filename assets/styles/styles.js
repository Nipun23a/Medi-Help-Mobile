// styles.ts
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    inner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 10,
    },
    subText: {
        fontSize: 18,
        color: '#FFF',
        marginBottom: 20,
    },
    qrContainer: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 20,
    },
    scannerContainer: {
        width: 300,
        height: 300,
        overflow: 'hidden',
        borderRadius: 10,
        marginBottom: 20,
    },
    idText: {
        fontSize: 16,
        color: '#FFF',
    },
    button: {
        backgroundColor: '#FFD700',
        padding: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    overlay:{
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    square: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: 'white',
        borderStyle: 'solid',
    },
});