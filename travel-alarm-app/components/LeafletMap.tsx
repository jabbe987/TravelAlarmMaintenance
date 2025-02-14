import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";

const LeafletMap = () => {
  const [location, setLocation] = useState(null);
  const webViewRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <style>
        html, body, #map { height: 100%; margin: 0; padding: 0; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([0, 0], 2); // Default until location is received
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        document.addEventListener("message", function(event) {
          var location;
          try {
            location = JSON.parse(event.data);
          } catch (e) {
            console.error("Invalid JSON data received:", event.data);
            return;
          }

          if (location.latitude && location.longitude) {
            var userLat = location.latitude;
            var userLng = location.longitude;

            map.setView([userLat, userLng], 13);

            var customIcon = L.icon({
              iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [0, -41],
            });

            L.marker([userLat, userLng], { icon: customIcon })
              .addTo(map)
              .bindPopup("You are here!")
              .openPopup();
          }
        });

        // Notify React Native WebView that Leaflet is ready
        window.onload = function() {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage("Leaflet Loaded");
          }
        };
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: mapHtml }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoad={() => {
          if (location) {
            webViewRef.current.injectJavaScript(`document.dispatchEvent(new MessageEvent('message', { data: '${JSON.stringify(location)}' }));`);
          }
        }}
      />
    </View>
  );
};

export default LeafletMap;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
