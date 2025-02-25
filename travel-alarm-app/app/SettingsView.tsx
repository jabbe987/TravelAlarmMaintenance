import React, { useState } from 'react';
import { View, Text, Button, Modal, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const SettingsView = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [alarmType, setAlarmType] = useState<'distance' | 'time'>('distance');
  const [distance, setDistance] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const router = useRouter();

  // Function to reset user and go back to selection
  const handleChangeUser = async () => {
    await AsyncStorage.removeItem('selectedUser');
    router.replace('/'); // Redirect to the main selection screen
  };

  return (
    <View style={styles.container}>
      <Button title="Choose Alarm Sound" onPress={() => alert('Alarm sound selection coming soon!')} />
      
      <Button title="Set Alarm by Distance/Time" onPress={() => setModalVisible(true)} />

      {/* Change User Button */}
      <Button title="Change User" onPress={handleChangeUser} color="red" />

      {/* Modal for Distance/Time Selection */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.header}>Set Alarm</Text>

            {/* Toggle between Distance and Time */}
            <View style={styles.toggleContainer}>
              <Button
                title="Distance"
                onPress={() => setAlarmType('distance')}
                color={alarmType === 'distance' ? 'blue' : 'gray'}
              />
              <Button
                title="Time"
                onPress={() => setAlarmType('time')}
                color={alarmType === 'time' ? 'blue' : 'gray'}
              />
            </View>

            {/* Input Fields */}
            {alarmType === 'distance' ? (
              <TextInput
                style={styles.input}
                placeholder="Enter distance (km)"
                keyboardType="numeric"
                value={distance}
                onChangeText={setDistance}
              />
            ) : (
              <TextInput
                style={styles.input}
                placeholder="Enter time (minutes)"
                keyboardType="numeric"
                value={time}
                onChangeText={setTime}
              />
            )}

            {/* Close Modal */}
            <Button title="Save & Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default SettingsView;
