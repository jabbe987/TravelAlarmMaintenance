import React, { useState } from 'react';
import axios from 'axios';

function Test() {
  const [words, setWords] = useState([]);
  const [showWords, setShowWords] = useState(false);

  const fetchWords = () => {
    axios.get('http://localhost:3000/api/words')  // ✅ Ensure this matches backend
      .then(response => {
        setWords(response.data);
        setShowWords(true);  // ✅ Show words when fetched
      })
      .catch(error => {
        console.error('Error fetching words:', error);
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
      {!showWords ? (
        <button 
          onClick={fetchWords} 
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px"
          }}>
          Show Words
        </button>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h2>Words from Database</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {words.map((word, index) => (
              <li key={index} style={{ fontSize: "18px", margin: "5px 0" }}>
                {word.word}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => setShowWords(false)} 
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

export default Test;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function Test() {
//   const [words, setWords] = useState([]);

//   useEffect(() => {
//     axios.get('http://localhost:3000/api/words')  // Match your backend API
//       .then(response => {
//         setWords(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching words:', error);
//       });
//   }, []);

//   return (
//     <div>
//       <h2>Words from Database</h2>
//       <ul>
//         {words.map((word, index) => (
//           <li key={index}>{word.word}</li>  // Adjust field name based on your DB
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default Test;
