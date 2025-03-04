import React, { useEffect, useState } from "react";
import axios from 'axios';
import { RootStackParamList  } from './types';
import { RouteProp, useRoute } from '@react-navigation/native';
import { View, Button, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

type AddTripScreenRouteProp = RouteProp<RootStackParamList, 'AddTrip'>;

const AddTrip = () => {
    const [formIsVisible, setFormIsVisible] = useState(false);
    const [locations, setLocations] = useState<Array<{ label: string; value: string}>>([]);
    const [duration, setDuration] = useState<string | null>(null);
    const [startPoint, setStartPoint] = useState("");
    const [endPoint, setEndPoint] = useState("");
    const [alarm, setAlarm] = useState("");
    const [openStart, setOpenStart] = useState(false);
    const [openEnd, setOpenEnd] = useState(false);
    const [openAlarm, setOpenAlarm] = useState(false);
    const [items, setItems] = useState([
        { label: "Alarm one", value: "Alarm one" },
        { label: "Alarm two", value: "Alarm two" },
        { label: "Alarm three", value: "Alarm three" },
        ])

    const route = useRoute<AddTripScreenRouteProp>();

    // ENSURE THAT DURATION HAS BEEN SET BEFORE ADDING TRIP 
    useEffect(() => {
       const postTrip = async () => {
        // TODO:  CREATE USER CONTEXT TO USE ID ALL OVER APPLICATION, USE DISTANCE ROUTER TO CALCULATE ETA
        const response = await axios.post('http://192.168.68.57:3001/api/addtrip', 
          { Alarm_ID: 0, User_ID: 1, Start: startPoint, End: endPoint, ETA: duration})
        .then(response => {
          console.log("Success", response)
        })
        .catch(error => {
          console.log("Error posting trip - ", error)
        })
        console.log(response)
       }

       postTrip();
    }, [duration]);

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

    const handleSubmit = async () => {
        let startPlace = "";
        let endPlace = "";

        locations.map((loc) => { 
          let place = loc.value

          if (place === startPoint) {
            startPlace = loc.label
          } else if (place == endPoint) {
            endPlace = loc.label
          }
        })
        axios.get('http://155.4.245.117:8000/api/distance', {
          params: {
              origins: startPlace,
              destinations: endPlace
          }
      })
      .then(response => {

        const result = response.data["duration"];
        
        setDuration(result)
        })
        .catch(error => {
            console.error('Error fetching distance:', error);
        });
    }

    return (

        <View style={styles.container}>
            <DropDownPicker
                open={openStart}
                value={startPoint}
                items={locations}
                setOpen={setOpenStart}
                setValue={setStartPoint}
                setItems={setLocations}
                placeholder= "Select start point..."
                containerStyle={styles.dropdownContainer}
                style={[styles.dropdownStyle, { zIndex: openStart ? 3 : 1 }]}
            />

            <DropDownPicker
                open={openEnd}
                value={endPoint}
                items={locations}
                setOpen={setOpenEnd}
                setValue={setEndPoint}
                setItems={setLocations}
                placeholder= "Select end point..."
                containerStyle={styles.dropdownContainer}
                style={[styles.dropdownStyle, { zIndex: openEnd ? 3 : 1 }]}
            />

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

            <Button title="Submit" onPress={handleSubmit} />
        </View>        
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      gap:10,
    },
    dropdownContainer: {
      height: 40,
      marginBottom: 10,
      marginTop: 20,
    },
    dropdownStyle: {
      backgroundColor: 'white',
    },
  });

export default AddTrip;