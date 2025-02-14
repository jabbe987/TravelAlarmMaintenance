import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const UserView: React.FC = () => {
    const [words, setWords] = useState<string>('');

    const fetchWords = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/words'); // Replace with your actual backend URL
            setWords(response.data);
        } catch (error) {
            console.error('Error fetching words:', error);
            setWords('Failed to fetch words');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Travel Alarm</Text>
            <Button title="Fetch Words" onPress={fetchWords} />
            <Text style={styles.words}>{words}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    words: {
        marginTop: 20,
        fontSize: 18,
        color: 'blue'
    }
});

export default UserView;
