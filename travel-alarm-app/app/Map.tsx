// import React, { useEffect, useRef, useState } from "react";
// import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
// import MapView, { Marker, Polyline } from "react-native-maps";
// import * as Location from "expo-location";
// import polyline from "@mapbox/polyline";
// import { Trip, RootStackParamList } from "./types";
// import { RouteProp, useRoute } from "@react-navigation/native";
// import ETAUpdater from "./ETAUpdater";

// const GOOGLE_DIRECTIONS_URL = "https://maps.googleapis.com/maps/api/directions/json";

// type MapScreenRouteProp = RouteProp<RootStackParamList, "Map">;
// type RouteCoordinate = { latitude: number; longitude: number };

// const MapComponent = () => {
//   const [routeCoordinates, setRouteCoordinates] = useState<RouteCoordinate[]>([]);
//   const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
//   const [origin, setOrigin] = useState<{ latitude: number; longitude: number } | null>(null);
//   const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);
//   const [trip, setTrip] = useState<Trip | null>(null);
//   const [estimatedTimeArrival, setETA] = useState<string | null>(null);
//   const [isActiveTrip, setIsActiveTrip] = useState(false);
//   const [googleApiKey, setGoogleApiKey] = useState<string | null>(null);

//   const mapRef = useRef<MapView | null>(null);
//   const route = useRoute<MapScreenRouteProp>();

//   useEffect(() => {
//     const fetchApiKey = async () => {
//       try {
//         const response = await fetch("http://155.4.245.117:8000/api/config"); 
//         const data = await response.json();
//         setGoogleApiKey(data.GOOGLE_API_KEY);
//         console.log("✅ Google API Key loaded:", data.GOOGLE_API_KEY);
//       } catch (error) {
//         console.error("❌ Error fetching API key:", error);
//       }
//     };
//     fetchApiKey();
//   }, []);

//   const fetchGoogleRoute = async () => {
//     if (origin && destination && googleApiKey) {
//       const url = `${GOOGLE_DIRECTIONS_URL}?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${googleApiKey}`;

//       try {
//         console.log("📍 Fetching Google Maps route:", url);
//         const response = await fetch(url);
//         const data = await response.json();

//         if (data.status !== "OK") {
//           console.error("❌ Google Maps API error:", data.error_message || data.status);
//           return;
//         }

//         const points = polyline.decode(data.routes[0].overview_polyline.points);
//         const routeCoords = points.map(([lat, lng]: [number, number]) => ({ latitude: lat, longitude: lng }));
//         setRouteCoordinates(routeCoords);

//         if (mapRef.current) {
//           mapRef.current.fitToCoordinates(routeCoords, {
//             edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
//             animated: true,
//           });
//         }
//       } catch (error) {
//         console.error("❌ Error fetching Google route:", error);
//       }
//     }
//   };

//   const startTrip = async () => {
//     console.log("🚀 Starting Trip");
//     try {
//       const response = await fetch("http://155.4.245.117:8000/api/active-trip-status");
//       const data = await response.json();
//       console.log("📍 Active Trip Status:", data);

//       setIsActiveTrip(data.isActive);
//     } catch (error) {
//       console.error("❌ Error fetching active trip status:", error);
//     }
//   };

//   useEffect(() => {
//     console.log("📍 useEffect triggered - trip:", trip);
//     if (trip) {
//       const { Start, End, ETA } = trip;
//       console.log("🕒 ETA: ", ETA);
//       setETA(ETA);

//       const trimmedStart = Start.split(",").map((item: string) => parseFloat(item.trim()));
//       const trimmedEnd = End.split(",").map((item: string) => parseFloat(item.trim()));

//       setOrigin({ latitude: trimmedStart[0], longitude: trimmedStart[1] });
//       setDestination({ latitude: trimmedEnd[0], longitude: trimmedEnd[1] });
//     }
//   }, [trip]);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         console.error("❌ Permission to access location was denied");
//         return;
//       }
//       let currentLocation = await Location.getCurrentPositionAsync({});
//       setUserLocation(currentLocation.coords);
//     })();
//   }, []);

//   useEffect(() => {
//     if (route.params?.trip) {
//       setTrip(route.params.trip);
//     }
//   }, [route.params?.trip]);

//   useEffect(() => {
//     if (googleApiKey) {
//       fetchGoogleRoute();
//     }
//   }, [origin, destination, googleApiKey]);

//   return (
//     <View style={styles.container}>
//       {userLocation && (
//         <MapView
//           ref={mapRef}
//           style={styles.map}
//           initialRegion={{
//             latitude: userLocation.latitude,
//             longitude: userLocation.longitude,
//             latitudeDelta: 0.05,
//             longitudeDelta: 0.05,
//           }}
//           showsUserLocation
//         >
//           {origin && destination && (
//             <>
//               <Marker coordinate={origin} title="Start" />
//               <Marker coordinate={destination} title="Destination" />
//             </>
//           )}

//           {routeCoordinates.length > 0 && (
//             <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="blue" />
//           )}
//         </MapView>
//       )}

//       {/* Updated Button Layout */}
//       <View style={styles.mapBottomBar}>
//         <TouchableOpacity onPress={startTrip} style={styles.buttonStartTrip}>
//           <Text style={styles.buttonStartTripText}> Start Trip </Text>
//         </TouchableOpacity>
//         <Text style={styles.ETA}>{estimatedTimeArrival ? "ETA: " + estimatedTimeArrival : "ETA: Not Available"}</Text>
//       </View>

//       {isActiveTrip && <ETAUpdater setETA={setETA} />}
//     </View>
//   );
// };

// export default MapComponent;

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center" },
//   map: { width: "100%", height: "100%" },
//   mapBottomBar: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 15,
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//   },
//   buttonStartTrip: {
//     backgroundColor: "blue",
//     borderRadius: 5,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     alignItems: "center",
//   },
//   buttonStartTripText: { color: "white", fontSize: 14 },
//   ETA: { color: "white", fontSize: 14, paddingLeft: 10 },
// });






//////OLD VERSION //////

// import React, { useEffect, useRef, useState } from "react";
// import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
// import MapView, { Marker, Polyline } from "react-native-maps";
// import * as Location from "expo-location";
// import polyline from "@mapbox/polyline";
// import { Trip, RootStackParamList } from "./types";
// import { RouteProp, useRoute } from "@react-navigation/native";
// import ETAUpdater from "./ETAUpdater"; // ✅ Corrected import path

// const OSRM_API_URL = "https://router.project-osrm.org/route/v1/driving";

// type MapScreenRouteProp = RouteProp<RootStackParamList, "Map">;
// type RouteCoordinate = { latitude: number; longitude: number };

// const MapComponent = () => {
//   const [routeCoordinates, setRouteCoordinates] = useState<RouteCoordinate[]>([]);
//   const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
//   const [origin, setOrigin] = useState<{ latitude: number; longitude: number } | null>(null);
//   const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);
//   const [trip, setTrip] = useState<Trip | null>(null);
//   const [estimatedTimeArrival, setETA] = useState<string | null>(null);
//   const [isActiveTrip, setIsActiveTrip] = useState(false);

//   const mapRef = useRef<MapView | null>(null);
//   const route = useRoute<MapScreenRouteProp>();

//   const startTrip = async () => {
//     console.log("Starting Trip");
//     try {
//       const response = await fetch("http://155.4.245.117:8000/api/active-trip-status");
//       //console.log("response: ",response);
//       const data = await response.json();
//       console.log("data :",data);
//       setIsActiveTrip(data.isActive);
//       console.log("setIsActiveTrip: ", setIsActiveTrip);
//     } catch (error) {
//       console.error("Error fetching active trip status:", error);
//     }
//   };

//   useEffect(() => {
//     console.log("useEffect triggered - trip:", trip);
//     if (trip) {
//       const start = trip.Start;
//       const end = trip.End;
//       const ETA = trip.ETA;
//       console.log("ETA: ", ETA);
//       setETA(ETA);

//       const trimmedStart = start.split(",").map((item: string) => parseFloat(item.trim()));
//       const trimmedEnd = end.split(",").map((item: string) => parseFloat(item.trim()));

//       setOrigin({ latitude: trimmedStart[0], longitude: trimmedStart[1] });
//       setDestination({ latitude: trimmedEnd[0], longitude: trimmedEnd[1] });
//     }
//   }, [trip]);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         console.error("Permission to access location was denied");
//         return;
//       }
//       let currentLocation = await Location.getCurrentPositionAsync({});
//       setUserLocation(currentLocation.coords);
//     })();
//   }, []);

//   useEffect(() => {
//     if (route.params?.trip) {
//       const chosenTrip = route.params.trip;
//       setTrip(chosenTrip);
//     }
//   }, [route.params?.trip]);

//   useEffect(() => {
//     fetchOSRMRoute();
//   }, [origin, destination]);

//   const fetchOSRMRoute = async () => {
//     if (origin !== null && destination !== null) {
//       const url = `${OSRM_API_URL}/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=polyline`;
//       try {
//         const response = await fetch(url);
//         const data = await response.json();

//         if (data.routes.length > 0) {
//           const points: [number, number][] = polyline.decode(data.routes[0].geometry);
//           const routeCoords = points.map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
//           setRouteCoordinates(routeCoords);

//           if (mapRef.current) {
//             mapRef.current.fitToCoordinates(routeCoords, {
//               edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
//               animated: true,
//             });
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching OSRM route:", error);
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {userLocation && (
//         <MapView
//           ref={mapRef}
//           style={styles.map}
//           initialRegion={{
//             latitude: userLocation.latitude,
//             longitude: userLocation.longitude,
//             latitudeDelta: 0.05,
//             longitudeDelta: 0.05,
//           }}
//           showsUserLocation
//         >
//           {origin && destination && (
//             <>
//               <Marker coordinate={origin} title="Start" />
//               <Marker coordinate={destination} title="Destination" />
//             </>
//           )}

//           {routeCoordinates.length > 0 && (
//             <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="blue" />
//           )}
//         </MapView>
//       )}

//       <View style={styles.mapBottomBar}>
//         <TouchableOpacity onPress={startTrip} style={styles.buttonStartTrip}>
//           <Text style={styles.buttonStartTripText}> Start Trip </Text>
//         </TouchableOpacity>
//         {estimatedTimeArrival && <Text style={styles.ETA}>{"ETA: " + estimatedTimeArrival}</Text>}
//       </View>

//       {isActiveTrip && <ETAUpdater setETA={setETA} />}
//     </View>
//   );
// };

// export default MapComponent;

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center" },
//   map: { width: "100%", height: "100%" },
//   mapBottomBar: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 15,
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//   },
//   buttonStartTrip: {
//     backgroundColor: "blue",
//     borderRadius: 5,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     alignItems: "center",
//   },
//   buttonStartTripText: { color: "white", fontSize: 14 },
//   ETA: { color: "white", fontSize: 14, paddingLeft: 10 },
// });

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
    console.log("🚀 Starting Trip");
    try {
      const response = await fetch("http://155.4.245.117:8000/api/active-trip-status");
      const data = await response.json();
      console.log("📍 Active Trip Status:", data);

      setIsActiveTrip(data.isActive);
      console.log()
    } catch (error) {
      console.error("❌ Error fetching active trip status:", error);
    }
  };

    // ✅ When trip changes, update origin and destination
  useEffect(() => {
    if (trip) {
      console.log("📍 Trip updated:", trip);
      const { Start, End } = trip;
      const trimmedStart = Start.split(",").map((item: string) => parseFloat(item.trim()));
      const trimmedEnd = End.split(",").map((item: string) => parseFloat(item.trim()));

      setOrigin({ latitude: trimmedStart[0], longitude: trimmedStart[1] });
      setDestination({ latitude: trimmedEnd[0], longitude: trimmedEnd[1] });
    }
  }, [trip]);

  // ✅ Fetch ETA only when origin & destination are updated (not before)
  useEffect(() => {
    if (origin && destination && googleApiKey) {
      fetchGoogleETA();
    }
  }, [origin, destination, googleApiKey]); // Now fetchGoogleETA runs with the latest trip details




  //   // ✅ Fetch ETA when the trip changes
  //   useEffect(() => {
  //     if (trip) {
  //       console.log("📍 Trip updated:", trip);
  //       const { Start, End } = trip;
  //       const trimmedStart = Start.split(",").map((item: string) => parseFloat(item.trim()));
  //       const trimmedEnd = End.split(",").map((item: string) => parseFloat(item.trim()));
  
  //       setOrigin({ latitude: trimmedStart[0], longitude: trimmedStart[1] });
  //       setDestination({ latitude: trimmedEnd[0], longitude: trimmedEnd[1] });
  
  //       if (googleApiKey) {
  //         fetchGoogleETA(); // 🔹 Fetch ETA when trip updates
  //       }
  //     }
  //   }, [trip, googleApiKey]);


  // // ✅ Fetch ETA using Google Distance Matrix API
  const fetchGoogleETA = async () => {
    if (!origin) return console.error("❌ Origin is missing");
    if (!destination) return console.error("❌ Destination is missing");
  
    try {
      console.log("📡 Requesting ETA from backend...");
      const response = await fetch(`http://155.4.245.117:8000/api/eta?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}`);
      const data = await response.json();
  
      if (data.error) {
        console.error("❌ Error fetching ETA:", data.error);
        return;
      }
  
      console.log("🕒 Updated ETA:", data.eta);
      setETA(data.eta);
    } catch (error) {
      console.error("❌ Error:", error);
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

      <View style={styles.mapBottomBar}>
        <TouchableOpacity onPress={startTrip} style={styles.buttonStartTrip}>
          <Text style={styles.buttonStartTripText}> Start Trip </Text>
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
