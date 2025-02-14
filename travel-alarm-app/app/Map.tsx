import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";

const MapComponent = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          {/* Marker for the current location
          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }}>
            <View style={styles.marker}>
              <Text style={styles.markerText}>📍 You are here</Text>
            </View>
          </Marker> */}

          {/* Red Circle Around the Position */}
          {/* <Circle
            center={{ latitude: location.latitude, longitude: location.longitude }}
            radius={500} // Radius in meters
            strokeColor="red"
            fillColor="rgba(255,0,0,0.3)"
          /> */}
        </MapView>
      ) : (
        <Text style={styles.loadingText}>{errorMsg || "Fetching location..."}</Text>
      )}
    </View>
  );
};

export default MapComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  marker: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
  },
  markerText: {
    fontWeight: "bold",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
  },
});
