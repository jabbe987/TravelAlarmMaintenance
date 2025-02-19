import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Trip, RootStackParamList } from './types';
import Modal from 'react-native-modal';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

const DropDown = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]); 
  const [tripName, setTripName] = useState<string | null>(null);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const navigateToDetails = (value: number) => {
    const trip = trips.find((trip) => trip.Trip_ID === value);
    console.log("NAVIGATE: ", trip)
    const tripData = trip;
    navigation.navigate('Map', { trip: tripData });
  };

  useEffect(() => {
    axios.get('http://192.168.68.119:3000/api/trips')
          .then(response => {
            setTrips(response.data);
          })
          .catch(error => {
            console.error('Error fetching words:', error);
            if (error.response) {
              console.error('Response error:', error.response.data);
            } else if (error.request) {
              console.error('Request error:', error.request);
            } else {
              console.error('General error:', error.message);
            }
        });
    
  }, []);

  const handleSelect = (value: number) => {
    console.log("SELECTING VALUE: ", value)
    if (value === 1) {
        setTripName('Selected Uppsala-Stockholm');
    } else {
        setTripName('Selected Uppsala-Ångström');
    }
    setSelectedValue(value); 
    closeModal(); 
    navigateToDetails(value);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openModal} style={styles.button}>
        <Text style={styles.buttonText}> {tripName ? tripName : 'Select a Trip'} </Text>
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal} 
        onBackButtonPress={closeModal} 
      >
        <View style={styles.modalContent}>
          {trips.map((trip) => (
            <TouchableOpacity
              key={trip.Trip_ID}
              onPress={() => handleSelect(trip.Trip_ID)}
              style={styles.option}
            >
              <Text style={styles.optionText}>{trip.Trip_ID === 1 ? "Uppsala-Stockholm" : "Uppsala-Ångström"}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {selectedValue && (
        <Text style={styles.selectedValueText}>You selected: {selectedValue}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  button: {
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 10,
    height: 100,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 18,
  },
  closeButton: {
    backgroundColor: 'red',
    width: 40,
    height: 30,
    alignItems: 'center',
    padding: 2,
    borderRadius: 5,
    marginTop: 5,
  },
  selectedValueText: {
    marginTop: 20,
    fontSize: 18,
    color: 'green',
  },
});

export default DropDown;
