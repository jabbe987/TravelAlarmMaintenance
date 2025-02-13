import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Component to dynamically update the map view
const LocationUpdater = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 13);
  }, [position, map]);
  return null;
};

// Define custom marker icon
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png", // Default Leaflet marker
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

const MapComponent = () => {
  const defaultPosition = [59.3293, 18.0686]; // Stockholm, Sweden (default)
  const [position, setPosition] = useState(defaultPosition);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          setPosition([location.coords.latitude, location.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <MapContainer center={position} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationUpdater position={position} />

      {/* Red Circle Around the Position */}
      <Circle
        center={position}
        radius={500} // Radius in meters
        pathOptions={{ fillColor: "red", color: "red", fillOpacity: 0.4 }}
      />

      <Marker position={position} icon={customIcon}>
        <Popup>
          <div style={{ textAlign: "center" }}>
            <p><strong>Your current location!</strong><br />Latitude: {position[0]}<br />Longitude: {position[1]}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
