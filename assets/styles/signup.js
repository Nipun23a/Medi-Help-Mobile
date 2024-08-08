import {StyleSheet} from "react-native";

export default StyleSheet.create({
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
        color: '#000',
    },
    inputContainer: {
        width: '100%',
    },
    roleContainer: {
        width: '100%',
        alignItems: 'center',
    },
    roleText: {
        fontSize: 18,
        color: '#000',
        marginBottom: 20,
    },
    roleButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
        width: '80%',
    },
    roleButtonText: {
        color: '#000',
        fontSize: 16,
        textAlign: 'center',
    },

    buttonContainer: {
        backgroundColor: '#FFD700',
        paddingVertical: 12,
        borderRadius: 5,
        width: '100%',
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#111',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkContainer: {
        alignItems: 'center',
        padding: 20,
    },
    bottomLink: {
        color: '#007bff',
        textDecorationLine: 'underline',
    },
    input: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginBottom: 10,
        width: '100%',

    },
    datePickerButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginBottom: 10,
        width: '100%',
        justifyContent: 'center',
    },
    datePickerText: {
        color: '#000',
    },
});