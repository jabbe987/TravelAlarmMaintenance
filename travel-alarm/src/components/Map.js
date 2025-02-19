import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L, { setOptions } from "leaflet";
import "leaflet/dist/leaflet.css";
import  LocationUpdater  from "./Location.js"
import { getLocation, updateLocation, stopUpdatingLocation, errorHandler } from "../utils/UserLocation";

// Define custom marker icon
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png", // Default Leaflet marker
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

const MapComponent = () => {
  const [location, setLocation] = useState([0,0]);
  const [permission, setPermission] = useState('not-asked');
  const [watchPosId, setWatchPosId] = useState(null);
  const map = useRef(null)

  useEffect(() => {
    console.log("RUNNING")

    getLocation(permission, setPermission, setLocation, location, {}, setWatchPosId)
  }, []);

  return (
    <MapContainer whenCreated={(mapInstance) => (map.current = mapInstance)} center={location} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationUpdater position={location} />

      {/* Red Circle Around the Position */}
      <Circle
        center={location}
        radius={500} // Radius in meters
        pathOptions={{ fillColor: "red", color: "red", fillOpacity: 0.4 }}
      />
      
      <Marker position={location} icon={customIcon}>
        <Popup>
          <div style={{ textAlign: "center" }}>
            <p><strong>Your current location!</strong><br />Latitude: {location[0]}<br />Longitude: {location[1]}</p>
          </div>
        </Popup>
      </Marker> 
    </MapContainer>
  );
};

export default MapComponent;
