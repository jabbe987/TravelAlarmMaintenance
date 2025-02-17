import { useEffect } from "react"
import { useMap } from "react-leaflet";
// Component to dynamically update the map view
const LocationUpdater = ({ position }) => {
    const map = useMap();
    
    useEffect(() => {
      if (position != null) {
        map.setView(position, 13);
      }
    }, [position, map]);
    return null;
};

export default LocationUpdater