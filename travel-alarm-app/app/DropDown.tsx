import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Trip, RootStackParamList } from './types';
import Modal from 'react-native-modal';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { apiUrl } from "../config";

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;
type AddTripModalNavigationProp = StackNavigationProp<RootStackParamList, 'AddTrip'>;


const DropDown = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [locations, setLocations] = useState<Array<{ label: string; value: string}>>([]);
  const [trips,  setTrips] = useState<Trip[]>([]); 
  const [tripName, setTripName] = useState<string | null>(null);
  const navigationToMap = useNavigation<MapScreenNavigationProp>();
  const navigationToAddTrip = useNavigation<AddTripModalNavigationProp>();
  const [tripLabels, setTripLabels] = useState<Record<number, string>>({});  

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const addTrip = () => {
    setIsModalVisible(false);
    navigationToAddTrip.navigate('AddTrip', {userId: 1});
  }

  useEffect(() => {
    const getTripLabels = () => {
      const labels: Record<number, string> = {};

      trips.forEach(async trip => {
        const start = await getLocation(trip.Start);
        const end = await getLocation(trip.End);
        labels[trip.Trip_ID] = `${start} - ${end}`;
      })

      setTripLabels(labels);
    };

    if (trips.length > 0) {
      getTripLabels();
    }
  }, [trips, locations]);

  const navigateToDetails = (value: number) => {
    const trip = trips.find((trip: { Trip_ID: number; }) => trip.Trip_ID === value);
    console.log("NAVIGATE: ", trip)
    const tripData = trip;
    if (trip) {
      navigationToMap.navigate('Map', { trip: tripData });
    } else {
      throw console.error("Trip could not be loaded onto map");
    }
  };

  useEffect(() => {
    axios.get(`${apiUrl}8000/api/locations`)
    .then(response => {
      const location = response.data
      const formattedLocations = location.map((loc: { Name: string; Coordinates: string; }) => ({
        label: loc.Name, 
        value: loc.Coordinates,   
    }));
    setLocations(formattedLocations);
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
  }, [])

  useEffect(() => {
    console.log("SETTING TRIPS")
    axios.get(`${apiUrl}8000/api/trips`)
          .then(response => {
            console.log("SETTING TRIPS", response.data)
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

  const createLocation = async (loc: string) => {
    const responseGet = await axios.get(`${apiUrl}8000/api/distance`, {
      params: {
          origins: loc,
          destinations: "Uppsala"
      }
    })

    let data = responseGet.data.origin

    let name = data["name"]
    
    const locationObj = {"label": name, "value": loc}

    setLocations(prev => [...prev, locationObj])

    return locationObj
  }

  const handleSelect = async (trip: Trip) => {

    let tripString = await checkWhichTrip(trip);

    setTripName(tripString);

    setSelectedValue(trip.Trip_ID); 
    closeModal(); 
    navigateToDetails(trip.Trip_ID);
  };

  const getLocation = async (tripLoc: string) => {  
    locations.forEach(loc => {
      if (loc.value === tripLoc) {
        return loc.label;
      }
    })
    
    const newLoc = await createLocation(tripLoc);

    return newLoc.label;
  }

  const checkWhichTrip = async (trip: Trip) => {
    let start = await getLocation(trip.Start);
    let end = await getLocation(trip.End);

    return start + " - " + end;
  }
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
          {trips.map((trip: Trip) => (
            <TouchableOpacity
              key={trip.Trip_ID}
              onPress={() => handleSelect(trip)}
              style={styles.option}
            >
              <Text style={styles.optionText}>{tripLabels[trip.Trip_ID] ?? "Loading..."}</Text>
            </TouchableOpacity>
          ))}

          <View style={styles.bottomView}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.buttonTextBottom}>Close</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={addTrip} style={styles.closeButton}>
              <Text style={styles.buttonTextBottom}>Add Trip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingRight: 10,
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5, 
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 8, 
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 15, 
    borderRadius: 10,
    width: '70%', 
  },
  option: {
    padding: 10, 
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 12,
  },
  bottomView: {
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingRight: 10,
    gap: 20,
  },
  closeButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5, 
    alignItems: 'center',
    marginTop: 5,
  },
  buttonTextBottom: {
    color: 'white',
    fontSize: 16, 
  },
});

export default DropDown;
