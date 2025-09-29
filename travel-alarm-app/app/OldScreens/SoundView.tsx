// app/SoundView.tsx
import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import TriggerAlarm from "@/components/TriggerAlarm";

// Define your available sounds
const soundFiles = [
  {
    name: 'Retro Alarm',
    file: require('../../assets/sounds/mixkit-retro-game-emergency-alarm-1000.wav'),
  },

  {
    name: 'Slot Machine',
    file: require('../../assets/sounds/mixkit-slot-machine-payout-alarm-1996.wav'),
  },

  {
    name: 'Beep',
    file: require('../../assets/sounds/mixkit-alarm-digital-clock-beep-989.wav'),
  },
];

const SoundView = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [alarmVisible, setAlarmVisible] = useState(false);

  const playSound = async (file: any) => {
    // Unload the previous sound if it's still loaded
    if (sound) {
      await sound.unloadAsync();
    }

    // Load and play the new sound
    const { sound: newSound } = await Audio.Sound.createAsync(file);
    setSound(newSound);
    await newSound.playAsync();
  };

  const renderItem = ({ item }: { item: { name: string; file: any } }) => (
    <TouchableOpacity style={styles.button} onPress={() => playSound(item.file)}>
      <Text style={styles.buttonText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Sounds</Text>
      <FlatList
        data={soundFiles}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
      />

      <Button //TriggerAlarm component
        title="Trigger Alarm" 
        onPress={() => {
          console.log("Trigger Alarm button pressed!");
          setAlarmVisible(true);
        }} 
      />
      {/* TriggerAlarm component */}
      <TriggerAlarm visible={alarmVisible} onClose={() => setAlarmVisible(false)} /> 

    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#25299e',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SoundView;
