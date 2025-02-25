import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import polyline from "@mapbox/polyline";
import DropDown from "./DropDown";
import { Trip, RootStackParamList  } from './types';
import { RouteProp, useRoute } from '@react-navigation/native';

const OSRM_API_URL = "https://router.project-osrm.org/route/v1/driving";

type MapScreenRouteProp = RouteProp<RootStackParamList, 'Map'>;

type RouteCoordinate = { latitude: number; longitude: number };
const MapComponent = () => {
  const [routeCoordinates, setRouteCoordinates] = useState<RouteCoordinate[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [origin, setOrigin] = useState<{ latitude: number; longitude: number } | null>(null); 
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null); 
  const [trip, setTrip] = useState<Trip | null>(null);
  const [estimatedTimeArrrival, setETA] = useState<string | null>(null)

  const mapRef = useRef<MapView | null>(null);
  const route = useRoute<MapScreenRouteProp>();

  useEffect (() => {
    if (trip) {
      const start = trip.Start;
      const end = trip.End;
      const ETA = trip.ETA;

      console.log("ETA: ", ETA);
      setETA(ETA);

      const trimmedStart = start.split(',').map((item: string) => parseFloat(item.trim()));
      const trimmedEnd = end.split(',').map((item: string) => parseFloat(item.trim()));

      setOrigin({latitude: trimmedStart[0], longitude: trimmedStart[1]});
      setDestination({latitude: trimmedEnd[0], longitude: trimmedEnd[1]})
    }
    
  }, [trip])

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setUserLocation(currentLocation.coords);
    })();
  }, []);

  useEffect(() => {
    if (route.params?.trip) {
      const chosenTrip = route.params.trip;
      setTrip(chosenTrip);
    }
  }, [route.params?.trip]);

  useEffect(() => {
    fetchOSRMRoute();
  }, [origin, destination]);

  const fetchOSRMRoute = async () => {
    if (origin !== null && destination !== null) {

      const url = `${OSRM_API_URL}/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=polyline`;
      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes.length > 0) {
          const points: [number, number][] = polyline.decode(data.routes[0].geometry);
          const routeCoords = points.map(([lat, lng]) => ({ latitude: lat, longitude: lng }));

          setRouteCoordinates(routeCoords);

          if (mapRef.current) {
            mapRef.current.fitToCoordinates(routeCoords, {
              edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
              animated: true,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching OSRM route:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {userLocation &&
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
      >
        { origin && destination ? (
          <>
          <Marker coordinate={origin} title="Start" />
          <Marker coordinate={destination} title="Destination" /> 
          </> ) : null}

        {routeCoordinates.length > 0 && (
          <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="blue" />
        )}
      </MapView> }

      <View style={styles.mapHeader}>
        <DropDown />
        {estimatedTimeArrrival && <Text style={styles.ETA}>{estimatedTimeArrrival}</Text> }
      </View>
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
  menuButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    fontSize: 30, 
    color: 'black',
    padding: 10,
  },
  ETA: {
    padding: 20,
    marginTop: 0, 
    color: "white",
    fontSize: 18,
  },
  mapHeader: {
    backgroundColor: "black",
    width: "100%",
    height: 200,
    flexDirection: 'row', 
    gap: 10, 
  },
});
