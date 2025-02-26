import React, { useEffect, useState } from "react";
import { RootStackParamList  } from './types';
import { RouteProp, useRoute } from '@react-navigation/native';
import { View, TextInput, Button, Text, Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

type AddTripScreenRouteProp = RouteProp<RootStackParamList, 'AddTrip'>;

const AddTrip = () => {
    const [formIsVisible, setFormIsVisible] = useState(false);
    const [startPoint, setStartPoint] = useState("");
    const [endPoint, setEndPoint] = useState("");
    const [alarm, setAlarm] = useState("");
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: "Alarm one", value: "Alarm one" },
        { label: "Alarm two", value: "Alarm two" },
        { label: "Alarm three", value: "Alarm three" },
        ])

    const route = useRoute<AddTripScreenRouteProp>();

    useEffect (() => {
        console.log("Pressed Button, now in addTrip");

        setFormIsVisible(true);
    }, [route.params?.userId]);

    const handleSubmit = () => {
        console.log("SUBMITTING");
    }

    return (
    
        <View style={{padding: 20}}>
            <Text>Start: </Text>
            <TextInput
                style={{ backgroundColor: "grey", borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
                placeholder="Enter start"
                value={startPoint}
                onChangeText={setStartPoint}
            />

            <Text>End: </Text>
            <TextInput
                style={{backgroundColor: "grey", borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5}}
                placeholder="Enter end"
                value={endPoint}
                onChangeText={setEndPoint}
            />

            <Text>Choose Alarm:</Text>
            <DropDownPicker
                open={open}
                value={alarm}
                items={items}
                setOpen={setOpen}
                setValue={setAlarm}
                setItems={setItems}
                placeholder= "Select Alarm..."
            />

            <Button title="Submit" onPress={handleSubmit} />
        </View>
        
    );
};

export default AddTrip;