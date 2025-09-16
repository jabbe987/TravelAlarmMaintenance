// import { useEffect, useState, useRef } from "react";
// import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, MapContainerProps } from "react-leaflet";
// import L, { setOptions } from "leaflet";
// import "leaflet/dist/leaflet.css";
// import  LocationUpdater  from "./Location.tsx"
// import { StyleSheet } from 'react-native';
// import { getLocation, updateLocation, stopUpdatingLocation, errorHandler } from "../utils/UserLocation";

// // Define custom marker icon
// const customIcon = new L.Icon({
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png", // Default Leaflet marker
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [0, -41],
// });

// const LeafletMap = () => {
//   const [location, setLocation] = useState([0,0]);
//   const [permission, setPermission] = useState('not-asked');
//   const [watchPosId, setWatchPosId] = useState(null);
//   const map = useRef<L.Map | null>(null);

//   useEffect(() => {
//     console.log("RUNNING")

//     getLocation(permission, setPermission, setLocation, location, {}, setWatchPosId)
//   }, []);


// //   const mapHtml = `
// //     <!DOCTYPE html>
// //     <html>
// //     <head>
// //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
// //       <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
// //       <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
// //       <style>
// //         html, body, #map { height: 100%; margin: 0; padding: 0; }
// //       </style>
// //     </head>
// //     <body>
// //       <div id="map"></div>
// //       <script>
// //         var map = L.map('map').setView([0, 0], 2); // Default until location is received
// //         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
// //           attribution: '© OpenStreetMap contributors'
// //         }).addTo(map);

// //         document.addEventListener("message", function(event) {
// //           var location;
// //           try {
// //             location = JSON.parse(event.data);
// //           } catch (e) {
// //             console.error("Invalid JSON data received:", event.data);
// //             return;
// //           }

// //           if (location.latitude && location.longitude) {
// //             var userLat = location.latitude;
// //             var userLng = location.longitude;

// //             map.setView([userLat, userLng], 13);

// //             var customIcon = L.icon({
// //               iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
// //               iconSize: [25, 41],
// //               iconAnchor: [12, 41],
// //               popupAnchor: [0, -41],
// //             });

// //             L.marker([userLat, userLng], { icon: customIcon })
// //               .addTo(map)
// //               .bindPopup("You are here!")
// //               .openPopup();
// //           }
// //         });

// //         // Notify React Native WebView that Leaflet is ready
// //         window.onload = function() {
// //           if (window.ReactNativeWebView) {
// //             window.ReactNativeWebView.postMessage("Leaflet Loaded");
// //           }
// //         };
// //       </script>
// //     </body>
// //     </html>
// //   `;

// //   return (
// //     <View style={styles.container}>
// //       <WebView
// //         ref={webViewRef}
// //         originWhitelist={["*"]}
// //         source={{ html: mapHtml }}
// //         javaScriptEnabled={true}
// //         domStorageEnabled={true}
// //         onLoad={() => {
// //           if (location) {
// //             webViewRef.current.injectJavaScript(`document.dispatchEvent(new MessageEvent('message', { data: '${JSON.stringify(location)}' }));`);
// //           }
// //         }}
// //       />
// //     </View>
// //   );
// // };
// return (
//   <MapContainer whenCreated={(mapInstance: L.Map) => (map.current = mapInstance)} center={location} zoom={13} style={{ height: "500px", width: "100%" }}>
//     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//     <LocationUpdater position={location} />

//     {/* Red Circle Around the Position */}
//     <Circle
//       center={location}
//       radius={500} // Radius in meters
//       pathOptions={{ fillColor: "red", color: "red", fillOpacity: 0.4 }}
//     />
    
//     <Marker position={location} icon={customIcon}>
//       <Popup>
//         <div style={{ textAlign: "center" }}>
//           <p><strong>Your current location!</strong><br />Latitude: {location[0]}<br />Longitude: {location[1]}</p>
//         </div>
//       </Popup>
//     </Marker> 
//   </MapContainer>
// );
// };
// export default LeafletMap;

// const styles = StyleSheet.create({
//   container: { flex: 1 },
// });
