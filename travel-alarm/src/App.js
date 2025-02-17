import React from 'react';
import logo from './logo.svg';
import './App.css';

import Test from './components/Test'; 
import GetLocation from './utils/UserLocation';
import Testroutes from './components/Testroutes';
import MapComponent from "./components/Map";


function App() {
  return (
    <div className="App">
    {/* //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header> */}

      <main>
        <h2>Words from Database</h2>

        <Testroutes/>

        <Test />

        {/* ✅ Debug text before rendering MapComponent */}
        <p>✅ Before MapComponent</p>

        {/* ✅ Ensure the map is properly included */}
        <h1>Travel Tracker Map</h1>
        <MapComponent />

        {/* ✅ Debug text after rendering MapComponent */}
        <p>✅ After MapComponent</p>

      </main>
    </div>
  );
}

export default App;
