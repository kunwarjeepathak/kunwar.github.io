// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles.css'; // Ensure this file exists for styling

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);