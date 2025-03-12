import React, { useEffect, useState } from 'react';
import { View, Text, Button, Modal, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

// Alarm sound files
const alarmSounds = {
  1: require('../assets/sounds/mixkit-retro-game-emergency-alarm-1000.wav'),
  2: require('../assets/sounds/mixkit-slot-machine-payout-alarm-1996.wav'),
  3: require('../assets/sounds/mixkit-alarm-digital-clock-beep-989.wav'),
};

type TriggerAlarmProps = {
  visible: boolean;
  onClose: () => void;
};

const TriggerAlarm: React.FC<TriggerAlarmProps> = ({ visible, onClose }) => {
  const [alarmSound, setAlarmSound] = useState<Audio.Sound | null>(null);
  const [selectedAlarmId, setSelectedAlarmId] = useState<number | null>(null);

  // Fetch the user's selected alarm sound **each time modal opens**
  useEffect(() => {
    const fetchAlarm = async () => {
      const userId = await AsyncStorage.getItem('selectedUser');
      if (!userId) return;

      try {
        const response = await fetch(`http://155.4.245.117:8000/api/alarm/${userId}`);
        const data = await response.json();
        if (data.Alarm_ID) {
          console.log("Fetched Alarm ID:", data.Alarm_ID);
          setSelectedAlarmId(data.Alarm_ID);
        }
      } catch (error) {
        console.error('Error fetching alarm:', error);
      }
    };

    if (visible) {
      fetchAlarm();
    }
  }, [visible]);

  // Play the alarm sound in a loop when modal is visible
  useEffect(() => {
    let isMounted = true;
    
    const playAlarm = async () => {
      if (!selectedAlarmId || !alarmSounds[selectedAlarmId]) return;

      try {
        console.log("Playing alarm sound...");
        const { sound } = await Audio.Sound.createAsync(alarmSounds[selectedAlarmId], { isLooping: true });

        if (isMounted) {
          setAlarmSound(sound);
          await sound.playAsync();
        }
      } catch (error) {
        console.error('Error playing alarm:', error);
      }
    };

    if (visible) {
      playAlarm();
    }

    return () => {
      isMounted = false;
      stopAlarm(false); // Do NOT close modal automatically when unmounting
    };
  }, [visible, selectedAlarmId]);

  // Stop the alarm **only when "Stop Alarm" is pressed**
  const stopAlarm = async (closeModal: boolean = true) => {
    if (alarmSound) {
      console.log("Stopping alarm...");
      await alarmSound.stopAsync();
      await alarmSound.unloadAsync();
      setAlarmSound(null);
    }

    if (closeModal) {
      onClose(); // Only close the modal when explicitly stopping
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>🚨 Alarm Triggered! 🚨</Text>
          <Text style={styles.subtitle}>Your selected alarm is playing.</Text>
          <Button title="Stop Alarm" onPress={() => stopAlarm(true)} color="red" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: 'red' },
  subtitle: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
});

export default TriggerAlarm;
