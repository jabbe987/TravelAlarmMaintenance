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
    const [startCoord, setStartCoord] = useState("");
    const [endCoord, setEndCoord] = useState("");
    const [alarm, setAlarm] = useState("");
    const [openStart, setOpenStart] = useState(false);
    const [openEnd, setOpenEnd] = useState(false);
    const [openAlarm, setOpenAlarm] = useState(false);
    const [googleApiKey, setGoogleApiKey] = useState<string | null>(null);
    const [filteredLocations, setFilteredLocations] = useState(locations);
    const [showStartPoint, setShowStartPoint] = useState(false);
    const [showEndPoint, setShowEndPoint] = useState(false);
    const [items, setItems] = useState([
        { label: "Alarm one", value: "Alarm one" },
        { label: "Alarm two", value: "Alarm two" },
        { label: "Alarm three", value: "Alarm three" },
        ])

    const route = useRoute<AddTripScreenRouteProp>();

    const checkIfTextIsEmpty = (text: string) => {
      if (text.length > 0) {
        return true
      }

      return false
    }

    const handleChange = (text: string, type: string) => {
      if (type == "START") {
        setStartPoint(text);

        let checker = checkIfTextIsEmpty(text);

        setShowStartPoint(checker)
      } else {
        setEndPoint(text)

        let checker = checkIfTextIsEmpty(text);

        setShowEndPoint(checker)
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
        console.log(startPoint, endPoint, locations);
        await new Promise<void>((resolve) => {
          locations.map((loc) => {
            console.log(loc.label, startPoint)
            if (startPoint == loc.label) {
              setStartCoord(loc.value);
              resolve();
            } else if (endPoint == loc.label) {
              setEndCoord(loc.value);
              resolve();
            }
          })

          resolve();
        })
        let startCoordString = ""
        if (startCoord.length == 0) {
          const responseGet = await axios.get('http://155.4.245.117:8000/api/distance', {
            params: {
                origins: startPoint,
                destinations: "Uppsala"
            }
          })

          let data = responseGet.data.origin

          startCoordString = data["latitude"] + ", " + data["longitude"]
          console.log("START COORD STRING SET", startCoordString)
          setStartCoord(startCoordString)
          

          console.log("INSERTING LOC: ", startCoordString, startPoint)
          const response = await axios.post('http://155.4.245.117:8000/api/addLocation', 
            { startPoint, startCoordString})
            .then(response => {
              console.log("Success", response)
            })
            .catch(error => {
              console.log("Error posting locations - ", error)
            })
        }

        let endCoordString = ""
        if (endCoord.length == 0) {
          const responseGet = await axios.get('http://155.4.245.117:8000/api/distance', {
            params: {
                origins: endPoint,
                destinations: "Uppsala"
            }
          })
          let data = responseGet.data.origin

          endCoordString = data["latitude"] + ", " + data["longitude"]
          console.log("END COORD STRING SET", endCoordString)
          setEndCoord(endCoordString)

          console.log("INSERTING LOC: ", endPoint, endCoordString)
          const response = await axios.post('http://155.4.245.117:8000/api/addLocation', 
            { endPoint, endCoordString})
            .then(response => {
              console.log("Success", response)
            })
            .catch(error => {
              console.log("Error posting locations - ", error)
            })
            
        }

        console.log(startCoord, endCoord)

        // const response = await axios.post('http://155.4.245.117:8000/api/addtrip', 
        //   { Alarm_ID: 0, User_ID: 1, Start: startCoord, End: endCoord, ETA: ""})
        // .then(response => {
        //   console.log("Success", response)
        // })
        // .catch(error => {
        //   console.log("Error posting trip - ", error)
        // })
        
    }

    const closeDropdownStart = (val: boolean) => {
      setShowStartPoint(!val)
    }

    const closeDropdownEnd = (val: boolean) => {
      setShowEndPoint(!val)
    }

    return (

        <View style={styles.container}>
              <View>
                <TextInput
                  value={startPoint}
                  onChangeText={((value) => handleChange(value, "START"))}
                  placeholder="Type to search..."
                  style={styles.input}
                />
                {showStartPoint && filteredLocations.length > 0 && startPoint != null && startPoint.length > 0 &&  (
                  <TouchableWithoutFeedback onPress={() => closeDropdownStart(showStartPoint)}> 
                  <View style={styles.dropdownWrapper}>
                    <FlatList
                      data={filteredLocations}
                      keyExtractor={(item) => item.label}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => {setStartPoint(item.label); closeDropdownStart(showStartPoint)}}>
                          <Text style={styles.listItem}>{item.label}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                  </TouchableWithoutFeedback>
                )}
              </View>

              <View>
                <TextInput
                  value={endPoint}
                  onChangeText={((value) => handleChange(value, "END"))}
                  placeholder="Type to search..."
                  style={styles.input}
                />
                {showEndPoint && filteredLocations.length > 0 && endPoint != null && endPoint.length > 0 &&  (
                  <TouchableWithoutFeedback onPress={() => closeDropdownEnd(showEndPoint)}> 
                    <View style={styles.dropdownWrapper}>
                      <FlatList
                        data={filteredLocations}
                        keyExtractor={(item) => item.label}
                        renderItem={({ item }) => (
                          <TouchableOpacity onPress={() => {setEndPoint(item.label); closeDropdownEnd(showEndPoint);}}>
                            <Text style={styles.listItem}>{item.label}</Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                )}
              </View>

              {/* <DropDownPicker
                  open={openAlarm}
                  value={alarm}
                  items={items}
                  setOpen={setOpenAlarm}
                  setValue={setAlarm}
                  setItems={setItems}
                  placeholder= "Select Alarm..."
                  containerStyle={styles.dropdownContainer}
                  style={[styles.dropdownStyle, { zIndex: openAlarm ? 3 : 1 }]}
                  dropDownContainerStyle={{ zIndex: 2000, elevation: 20 }} // Ensure dropdown opens above others
                  modalProps={{ transparent: true }}
              />  */}

            <Button title="Submit" onPress={handleSubmit}/>
        </View>        
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 10,
    position: "relative"
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
    position: 'absolute',  // Add this if not already set
    top: 50,  // Adjust based on input field position
    left: 10,
    right: 10,
    zIndex: 1000,  // Set a high zIndex
    backgroundColor: 'white',
    maxHeight: 150,
    borderWidth: 1,
    borderRadius: 5,
    elevation: 10,  // Android shadow fix
    shadowColor: '#000',  // iOS shadow fix
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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