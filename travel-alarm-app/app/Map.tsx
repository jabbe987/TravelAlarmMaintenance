import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker, Circle, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import polyline from "@mapbox/polyline";

const OSRM_API_URL = "https://router.project-osrm.org/route/v1/driving";

type RouteCoordinate = { latitude: number; longitude: number };
const MapComponent = () => {
  const [routeCoordinates, setRouteCoordinates] = useState<RouteCoordinate[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [origin, setOrigin] = useState<{ latitude: number; longitude: number } | null>(null); // San Francisco
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null); // Nearby point
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setUserLocation(currentLocation.coords);
      setOrigin(currentLocation.coords);
      setDestination({latitude: 59.839342722178976, longitude: 17.647042311387317})
    })();
  }, []);

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

          // Auto-zoom map to fit the route
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
        followsUserLocation
      >
        {/* Markers */}
        { origin && destination ? (
          <>
          <Marker coordinate={origin} title="Start" />
          <Marker coordinate={destination} title="Destination" /> 
          </> ) : null}

        {/* Draw Route */}
        {routeCoordinates.length > 0 && (
          <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="blue" />
        )}
      </MapView> }
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
