import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const DistanceView: React.FC = () => {
    const [origin, setOrigin] = useState<string>('');
    const [destination, setDestination] = useState<string>('');
    const [distance, setDistance] = useState<string | null>(null);
    const [duration, setDuration] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchDistance = () => {
        if (!origin || !destination) {
            setError('Please enter both origin and destination.');
            return;
        }

        axios.get('http://10.82.133.250:8000/api/distance', {
            params: {
                origins: origin,
                destinations: destination
            }
        })
        .then(response => {
            console.log(response.data)
            const result = response.data.rows[0].elements[0];
            if (result.status === 'OK') {
                setDistance(result.distance.text);
                setDuration(result.duration.text);
                setError(null);
            } else {
                setError('Could not calculate distance. Try different locations.');
            }
        })
        .catch(error => {
            console.error('Error fetching distance:', error);
            setError('Failed to fetch distance. Please try again later.');
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Google Maps Distance API Test</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter origin (e.g., Uppsala, Sweden)"
                value={origin}
                onChangeText={setOrigin}
            />

            <TextInput
                style={styles.input}
                placeholder="Enter destination (e.g., Stockholm, Sweden)"
                value={destination}
                onChangeText={setDestination}
            />

            <Button title="Get Distance" onPress={fetchDistance} />

            {distance && duration && (
                <View style={styles.result}>
                    <Text style={styles.resultText}>Distance: {distance}</Text>
                    <Text style={styles.resultText}>Duration: {duration}</Text>
                </View>
            )}

            {error && <Text style={styles.error}>{error}</Text>}
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
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10
    },
    result: {
        marginTop: 20,
        alignItems: 'center'
    },
    resultText: {
        fontSize: 18,
        color: 'green'
    },
    error: {
        marginTop: 10,
        color: 'red'
    }
});

export default DistanceView;
