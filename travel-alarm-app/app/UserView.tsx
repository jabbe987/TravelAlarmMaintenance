import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { apiUrl } from "../config";

const UserView: React.FC = () => {
    const [words, setWords] = useState<string>('');
    const [showWords, setShowWords] = useState(false);

    // const fetchWords = async () => {
    //     try {
    //         const response = await axios.get('apiUrl3000/api/words'); // Replace with your actual backend URL
    //         setWords(response.data);
    //     } catch (error) {
    //         console.error('Error fetching words:', error);
    //         setWords('Failed to fetch words');
    //     }
    // };

    const fetchWords = () => {
        axios.get(`${apiUrl}8000/api/words`)  // //apiUrl3000/api/words

        // axios.get('apiUrl8000/api/words')  // //apiUrl3000/api/words

          .then(response => {
            console.log(response.data); // Log response to debug
            setWords(JSON.stringify(response.data, null, 2)); // Convert to readable string
            setShowWords(true);
          })
          .catch(error => {
            console.error('Error fetching words:', error);
          });
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
