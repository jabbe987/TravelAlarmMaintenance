import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const SettingsView = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [alarmType, setAlarmType] = useState<'distance' | 'time'>('distance');
  const [distance, setDistance] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const router = useRouter();

  // Fetch current settings when the component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const userId = await AsyncStorage.getItem('selectedUser');
        if (!userId) {
          console.warn('No user found');
          return;
        }

        const response = await fetch(`http://155.4.245.117:8000/api/settings/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user settings');
        }

        const data = await response.json();
        console.log('Fetched user settings:', data);

        // Update state with fetched settings
        setAlarmType(data.AlarmType === 0 ? 'distance' : 'time'); // BIT(1) stored as 0 or 1
        if (data.AlarmType === 0) {
          setDistance(data.AlarmValue.toString());
        } else {
          setTime(data.AlarmValue.toString());
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  // Function to reset user and go back to selection
  const handleChangeUser = async () => {
    await AsyncStorage.removeItem('selectedUser');
    router.replace('/'); // Redirect to the main selection screen
  };

  // Function to save user settings to backend
  const handleSaveSettings = async () => {
    try {
        const userId = await AsyncStorage.getItem('selectedUser');

        if (!userId) {
            alert('User not found!');
            return;
        }

        const settings = {
            userId,
            alarmType: alarmType === 'distance' ? 0 : 1, // Convert 'distance' -> 0, 'time' -> 1
            alarmValue: alarmType === 'distance' ? distance : time,
        };

        console.log('Saving settings:', settings);

        const response = await fetch('http://155.4.245.117:8000/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings),
        });

        const data = await response.json();
        console.log('Response:', data);

        if (!response.ok) {
            throw new Error(data.error || 'Failed to update settings');
        }

        alert('Settings updated successfully');

        // ✅ Close the modal and navigate back (if needed)
        setModalVisible(false);

    } catch (error) {
        console.error('Error:', error);
        alert('Error updating settings');
        setModalVisible(false);
    }
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

            {/* Save Button */}
            <Button title="Save & Close" onPress={handleSaveSettings} />
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
