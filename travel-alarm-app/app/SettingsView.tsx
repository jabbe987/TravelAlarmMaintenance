import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';

// Sound options
const alarmSounds = [
  { id: 1, name: 'Retro Alarm', file: require('../assets/sounds/mixkit-retro-game-emergency-alarm-1000.wav') },
  { id: 2, name: 'Slot Machine', file: require('../assets/sounds/mixkit-slot-machine-payout-alarm-1996.wav') },
  { id: 3, name: 'Beep', file: require('../assets/sounds/mixkit-alarm-digital-clock-beep-989.wav') },
];

const SettingsView = () => {
  const [soundModalVisible, setSoundModalVisible] = useState(false);
  const [selectedAlarm, setSelectedAlarm] = useState<number | null>(null);
  const [tempSelectedAlarm, setTempSelectedAlarm] = useState<number | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingSoundId, setPlayingSoundId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [alarmType, setAlarmType] = useState<'distance' | 'time'>('distance');
  const [distance, setDistance] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const router = useRouter();

  // Fetch settings from database
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const userId = await AsyncStorage.getItem('selectedUser');
        if (!userId) return;

        const response = await fetch(`http://155.4.245.117:8000/api/settings/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user settings');

        const data = await response.json();
        setAlarmType(data.AlarmType === 0 ? 'distance' : 'time');
        setSelectedAlarm(data.Alarm_ID || null);
        setTempSelectedAlarm(data.Alarm_ID || null);
        if (data.AlarmType === 0) setDistance(data.AlarmValue.toString());
        else setTime(data.AlarmValue.toString());
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  // Stop sound when leaving the modal
  useEffect(() => {
    return () => {
      stopSound();
    };
  }, [soundModalVisible]);

  // Play/Pause sound
  const toggleSound = async (soundId: number, file: any) => {
    if (playingSoundId === soundId) {
      stopSound(); // Pause if it's the same sound
    } else {
      stopSound(); // Stop currently playing sound first
      const { sound: newSound } = await Audio.Sound.createAsync(file);
      setSound(newSound);
      setPlayingSoundId(soundId);
      await newSound.playAsync();

      // When sound finishes, reset the button
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          stopSound();
        }
      });
    }
  };

  // Stop all sounds
  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    setPlayingSoundId(null);
  };

  // Save selected alarm
  const saveAlarm = async () => {
    if (tempSelectedAlarm === null) return;

    stopSound();
    const userId = await AsyncStorage.getItem('selectedUser');
    if (!userId) return;

    try {
      const response = await fetch('http://155.4.245.117:8000/api/alarm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, alarmId: tempSelectedAlarm }),
      });

      if (response.ok) {
        setSelectedAlarm(tempSelectedAlarm);
        setSoundModalVisible(false);
        alert('Alarm sound updated!');
      } else {
        alert('Error updating alarm sound');
      }
    } catch (error) {
      console.error('Error updating alarm:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Choose Alarm Sound" onPress={() => setSoundModalVisible(true)} />
      <Text>Selected Alarm: {selectedAlarm ? alarmSounds.find(a => a.id === selectedAlarm)?.name : 'None'}</Text>

      <Button title="Set Alarm by Distance/Time" onPress={() => setModalVisible(true)} />
      <Button title="Change User" onPress={async () => {
        await AsyncStorage.removeItem('selectedUser');
        router.replace('/');
      }} color="red" />

      {/* Modal for Alarm Sound Selection */}
      <Modal visible={soundModalVisible} transparent animationType="slide" onRequestClose={() => setSoundModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Select an Alarm Sound</Text>
            {alarmSounds.map((alarm) => (
              <TouchableOpacity 
                key={alarm.id} 
                style={[
                  styles.soundRow, 
                  tempSelectedAlarm === alarm.id && styles.selectedSound
                ]}
                onPress={() => setTempSelectedAlarm(alarm.id)} 
              >
                <Text style={styles.soundText}>{alarm.name}</Text>
                <TouchableOpacity 
                  style={styles.playButton} 
                  onPress={() => toggleSound(alarm.id, alarm.file)}
                >
                  <Text style={styles.buttonText}>{playingSoundId === alarm.id ? '⏸ Pause' : '▶ Play'}</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
            <Button title="Select" onPress={saveAlarm} />
            <Button title="Close" onPress={() => {
              stopSound();
              setSoundModalVisible(false);
            }} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  soundRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingVertical: 8, paddingHorizontal: 10 },
  selectedSound: { backgroundColor: '#cce5ff', borderRadius: 5 },
  soundText: { fontSize: 16, flex: 1 },
  playButton: { backgroundColor: '#25299e', padding: 10, borderRadius: 5 },
  buttonText: { color: '#fff', fontSize: 14 },
});

export default SettingsView;
