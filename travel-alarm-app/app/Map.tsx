import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import polyline from "@mapbox/polyline";
import { Trip, RootStackParamList } from "./types";
import { RouteProp, useRoute } from "@react-navigation/native";
import ETAUpdater from "./ETAUpdater"; // ✅ Keeps the ETA updater for active trips

const OSRM_API_URL = "https://router.project-osrm.org/route/v1/driving";
const GOOGLE_DISTANCE_MATRIX_URL = "https://maps.googleapis.com/maps/api/distancematrix/json";

type MapScreenRouteProp = RouteProp<RootStackParamList, "Map">;
type RouteCoordinate = { latitude: number; longitude: number };

const MapComponent = () => {
  const [routeCoordinates, setRouteCoordinates] = useState<RouteCoordinate[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [origin, setOrigin] = useState<{ latitude: number; longitude: number } | null>(null);
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [estimatedTimeArrival, setETA] = useState<string | null>(null);
  const [isActiveTrip, setIsActiveTrip] = useState(false);
  const [googleApiKey, setGoogleApiKey] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const mapRef = useRef<MapView | null>(null);
  const route = useRoute<MapScreenRouteProp>();

  // ✅ Fetch Google API Key
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await fetch("http://155.4.245.117:8000/api/config");
        const data = await response.json();
        setGoogleApiKey(data.GOOGLE_API_KEY);
        console.log("✅ Google API Key loaded:", data.GOOGLE_API_KEY);
      } catch (error) {
        console.error("❌ Error fetching API key:", error);
      }
    };
    fetchApiKey();
  }, []);

  const startTrip = async () => {
    console.log("Starting Trip");
    setIsActiveTrip(true);

    if(intervalRef.current) {
      clearInterval(intervalRef.current);
    } 

    fetchGoogleETA();

    intervalRef.current = setInterval(() => {
      console.log(" Fetching updated ETA from current location...");
      fetchGoogleETA();
    }, 20000);
  };

  const stopTrip = async () => {
    console.log("Stopping Trip");
    setIsActiveTrip(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // ✅ Fetch ETA only when trip is active
useEffect(() => {
  if (isActiveTrip) {
    console.log("⏳ Trip is active, fetching initial ETA...");
    fetchGoogleETA();
  } else {
    // Stop fetching ETA when trip is inactive
    stopTrip();
  }
}, [isActiveTrip]);

// ✅ Cleanup when component unmounts
useEffect(() => {
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, []);

    // ✅ Fetch ETA when the trip changes
    useEffect(() => {
      if (trip) {
        console.log("📍 Trip updated:", trip);
        const { Start, End } = trip;
        const trimmedStart = Start.split(",").map((item: string) => parseFloat(item.trim()));
        const trimmedEnd = End.split(",").map((item: string) => parseFloat(item.trim()));
  
        setOrigin({ latitude: trimmedStart[0], longitude: trimmedStart[1] });
        setDestination({ latitude: trimmedEnd[0], longitude: trimmedEnd[1] });
  
        if (googleApiKey) {
          fetchGoogleETA(); // 🔹 Fetch ETA when trip updates
        }
      }
    }, [trip, googleApiKey]);

  const fetchGoogleETA = async () => {
    try {
      console.log("📡 Getting current device location...");
  
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("❌ Permission to access location was denied");
        return;
      }
  
      let currentLocation = await Location.getCurrentPositionAsync({});
      const userLatitude = currentLocation.coords.latitude;
      const userLongitude = currentLocation.coords.longitude;
  
      console.log("📍 Current device location:", userLatitude, userLongitude);

      
      console.log(destination, origin)
  
      // if (!destination) {
      //   console.error("❌ Destination is missing");
      //   return;
      // }
      console.log("📡 Requesting ETA from backend using live location...");
      const response = await fetch(
        `http://155.4.245.117:8000/api/eta?origin=${userLatitude},${userLongitude}&destination=${destination.latitude},${destination.longitude}`
      );
  
      const data = await response.json();
  
      if (data.error) {
        console.error("❌ Error fetching ETA:", data.error);
        return;
      }
  
      console.log("🕒 Updated ETA:", data.eta);
      console.log("Updated Distance:", data.distance);
      setETA(data.eta);
      
    } 
    catch (error) {
      console.log("❌ Error fetching current location or ETA:", error);
    }
  };
  
  



  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("❌ Permission to access location was denied");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setUserLocation(currentLocation.coords);
    })();
  }, []);

  useEffect(() => {
    if (route.params?.trip) {
      setTrip(route.params.trip);
    }
  }, [route.params?.trip]);

  useEffect(() => {
    fetchOSRMRoute();
  }, [origin, destination]);

  useEffect(() => {
    if (isActiveTrip) {
      console.log("⏳ Trip is active, fetching ETA...");
      fetchGoogleETA();
    }
  }, [isActiveTrip]);
  // ✅ Fetch route from OSRM
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
        console.error("❌ Error fetching OSRM route:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {userLocation && (
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
          {origin && destination && (
            <>
              <Marker coordinate={origin} title="Start" />
              <Marker coordinate={destination} title="Destination" />
            </>
          )}

          {routeCoordinates.length > 0 && (
            <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="blue" />
          )}
        </MapView>
      )}

      {/* <View style={styles.mapBottomBar}>
        <TouchableOpacity onPress={startTrip} style={styles.buttonStartTrip}>
          <Text style={styles.buttonStartTripText}> Start Trip </Text>
        </TouchableOpacity>
        <Text style={styles.ETA}>{estimatedTimeArrival ? "ETA: " + estimatedTimeArrival : "ETA: Not Available"}</Text>
      </View> */}
      <View style={styles.mapBottomBar}>
        <TouchableOpacity onPress={isActiveTrip ? stopTrip : startTrip} style={styles.buttonStartTrip}>
          <Text style={styles.buttonStartTripText}>
            {isActiveTrip ? "Stop Trip" : "Start Trip"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.ETA}>{estimatedTimeArrival ? "ETA: " + estimatedTimeArrival : "ETA: Not Available"}</Text>
      </View>

      {isActiveTrip && <ETAUpdater setETA={setETA} />}
    </View>
  );
};

export default MapComponent;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  map: { width: "100%", height: "100%" },
  mapBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  buttonStartTrip: {
    backgroundColor: "blue",
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonStartTripText: { color: "white", fontSize: 14 },
  ETA: { color: "white", fontSize: 14, paddingLeft: 10 },
});
