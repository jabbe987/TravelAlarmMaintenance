import React from 'react';
import logo from './logo.svg';
import './App.css';
import Test from './components/Test';  // ✅ Correct import with uppercase "T"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      {/* ✅ Render the Test component here */}
      <main>
        <h2>Words from Database</h2>
        <Test />
      </main>
    </div>
  );
}

export default App;