import React from 'react';
import ReactDOM from 'react-dom/client'; // or 'react-dom'
//import './index.css'; // If you have global styles
import App from './App'; // Import your App component

// Render the App component inside the div with id 'root'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
