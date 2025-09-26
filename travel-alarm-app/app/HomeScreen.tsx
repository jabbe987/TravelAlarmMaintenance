import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const checkUser = async () => {
      // const storedUser = await AsyncStorage.getItem('selectedUser');
      if (storedUser) {
        navigation.replace('MainApp'); // Navigate to the main app if user is selected
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const selectUser = async (user: string) => {
    // await AsyncStorage.setItem('selectedUser', user);
    navigation.replace('MainApp'); // Navigate to the main app
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a User</Text>
      <Button title="User 1" onPress={() => selectUser('1')} />
      <Button title="User 2" onPress={() => selectUser('2')} />
      <Button title="User 3" onPress={() => selectUser('3')} />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default HomeScreen;
