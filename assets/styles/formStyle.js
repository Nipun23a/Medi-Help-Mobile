import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    formContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        alignSelf: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
        fontSize: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    pickerContainer: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
    },
    picker: {
        height: 50,
    },
});

export default styles;