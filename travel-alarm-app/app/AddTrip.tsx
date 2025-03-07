import React, { useEffect, useState } from "react";
import axios from 'axios';
import { RootStackParamList  } from './types';
import { RouteProp, useRoute } from '@react-navigation/native';
import { View, Button, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';


type AddTripScreenRouteProp = RouteProp<RootStackParamList, 'AddTrip'>;

interface locations {
  label: string
  value: string
}



const AddTrip = () => {
    const [formIsVisible, setFormIsVisible] = useState(false);
    const [locations, setLocations] = useState<Array<{ label: string; value: string}>>([]);
    const [startPoint, setStartPoint] = useState("");
    const [endPoint, setEndPoint] = useState("");
    const [alarm, setAlarm] = useState("");
    const [openStart, setOpenStart] = useState(false);
    const [openEnd, setOpenEnd] = useState(false);
    const [openAlarm, setOpenAlarm] = useState(false);
    const [googleApiKey, setGoogleApiKey] = useState<string | null>(null);
    const [filteredLocations, setFilteredLocations] = useState(locations);
    const [items, setItems] = useState([
        { label: "Alarm one", value: "Alarm one" },
        { label: "Alarm two", value: "Alarm two" },
        { label: "Alarm three", value: "Alarm three" },
        ])

    const route = useRoute<AddTripScreenRouteProp>();

    const handleChange = (text: string, type: string) => {
      if (type == "START") {
        setStartPoint(text);
      } else {
        setEndPoint(text)
      }

      setFilteredLocations(
        locations.filter((loc) =>
          loc.label.toLowerCase().includes(text.toLowerCase())
        )
      );
    }

    useEffect (() => {
        axios.get('http://155.4.245.117:8000/api/locations')
        .then(response => {
          const formattedLocations = response.data.map((loc: { Name: string; Coordinates: string; }) => ({
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

        setFormIsVisible(true);
    }, [route.params?.userId]);

      useEffect(() => {
        const fetchApiKey = async () => {
          try {
            const response = await fetch("http://155.4.245.117:8000/api/config");
            const data = await response.json();
            setGoogleApiKey(data.GOOGLE_API_KEY);
          } catch (error) {
            console.error("Error fetching API key:", error);
          }
        };
        fetchApiKey();
      }, []);

    const handleSubmit = async () => {
        //TODO:  CREATE USER CONTEXT TO USE ID ALL OVER APPLICATION, USE DISTANCE ROUTER TO CALCULATE ETA
        const response = await axios.post('http://155.4.245.117:8000/api/addtrip', 
          { Alarm_ID: 0, User_ID: 1, Start: startPoint, End: endPoint, ETA: ""})
        .then(response => {
          console.log("Success", response)
        })
        .catch(error => {
          console.log("Error posting trip - ", error)
        })
        
    }

    const closeDropdown = (val) => {
      
    }

    return (

        <View style={styles.container}>

              <TextInput
                value={startPoint}
                onChangeText={((value) => handleChange(value, "START"))}
                placeholder="Type to search..."
                style={styles.input}
              />
              {filteredLocations.length > 0 && startPoint != null && startPoint.length > 0 &&  (
                <TouchableWithoutFeedback onPress={closeDropdown(showStartPoint)}> 
                <View style={styles.dropdownWrapper}>
                  <FlatList
                    data={filteredLocations}
                    keyExtractor={(item) => item.label}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => setStartPoint(item.label)}>
                        <Text style={styles.listItem}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
                </TouchableWithoutFeedback>
              )}

              
              <TextInput
                value={endPoint}
                onChangeText={((value) => handleChange(value, "END"))}
                placeholder="Type to search..."
                style={styles.input}
              />
              {filteredLocations.length > 0 && endPoint != null && endPoint.length > 0 &&  (
                <TouchableWithoutFeedback onPress={closeDropdown(showEndPoint)}> 
                  <View style={styles.dropdownWrapper}>
                    <FlatList
                      data={filteredLocations}
                      keyExtractor={(item) => item.label}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => setStartPoint(item.label)}>
                          <Text style={styles.listItem}>{item.label}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </TouchableWithoutFeedback>
              )}

              <DropDownPicker
                  open={openAlarm}
                  value={alarm}
                  items={items}
                  setOpen={setOpenAlarm}
                  setValue={setAlarm}
                  setItems={setItems}
                  placeholder= "Select Alarm..."
                  containerStyle={styles.dropdownContainer}
                  style={[styles.dropdownStyle, { zIndex: openAlarm ? 3 : 1 }]}
              /> 

            <Button title="Submit" onPress={handleSubmit}/>
        </View>        
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 10,
  },
  input: {
    backgroundColor: "grey",
    color: "white",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  listItem: {
    padding: 10,
    zIndex: 210,  
    borderBottomWidth: 1,
  },
  dropdownWrapper: {
    position: 'absolute',  
    top: 100,  
    left: 10,
    right: 10,
    zIndex: 2,  
    backgroundColor: 'white',
    maxHeight: 150,
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdown: {
    width: '100%',
    position: 'absolute', 
    zIndex: 2,
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 20,
  },
  dropdownStyle: {
    borderWidth: 1,
    borderRadius: 5,
  },
  });

export default AddTrip;