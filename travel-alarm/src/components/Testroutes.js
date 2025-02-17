import React, { useState } from 'react';
import axios from 'axios';

function Testroutes() {
  const [trips, setTrips] = useState([]);
  const [showTrips, setShowTrips] = useState(false);

  const fetchTrips = () => {
    axios.get('http://localhost:3000/api/trips')  // ✅ Ensure this matches your backend
      .then(response => {
        setTrips(response.data);
        setShowTrips(true);  // ✅ Show trips when fetched
      })
      .catch(error => {
        console.error('Error fetching trips:', error);
      });
  };

  return (
    <div style={{
      backgroundColor: "white",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>
      {!showTrips ? (
        <button 
          onClick={fetchTrips} 
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px"
          }}>
          Show Trips
        </button>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h2>Trips from Database</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {trips.map((trip, index) => (
              <li key={index} style={{ fontSize: "18px", margin: "5px 0" }}>
                <strong>Trip ID:</strong> {trip.Trip_ID} <br />
                <strong>Start:</strong> {trip.Start} <br />
                <strong>End:</strong> {trip.End} <br />
                <strong>ETA:</strong> {trip.ETA} <br />
              </li>
            ))}
          </ul>
          <button 
            onClick={() => setShowTrips(false)} 
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "red",
              color: "white",
              border: "none",
              borderRadius: "5px"
            }}>
            Return
          </button>
        </div>
      )}
    </div>
  );
}

export default Testroutes;
