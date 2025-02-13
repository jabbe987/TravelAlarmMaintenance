import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const MainScreen = () => {
  const [words, setWords] = useState([]);
  const [showWords, setShowWords] = useState(false);

  const fetchWords = () => {
    axios.get('http://localhost:3000/api/words')  // ✅ Update with your backend URL
      .then(response => {
        setWords(response.data);
        setShowWords(true);
      })
      .catch(error => {
        console.error('Error fetching words:', error);
      });
  };

  return (
    <View style={styles.container}>
      {!showWords ? (
        <Button title="Show Words" onPress={fetchWords} />
      ) : (
        <View>
          <Text style={styles.title}>Words from Database</Text>
          <FlatList
            data={words}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Text style={styles.word}>{item.word}</Text>
            )}
          />
          <Button title="Return" onPress={() => setShowWords(false)} color="red" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  word: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default MainScreen;
