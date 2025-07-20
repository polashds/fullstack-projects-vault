// src/App.js
import React, { useState, useEffect } from 'react';
import Login from './Login';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [prediction, setPrediction] = useState('');
  const [inputText, setInputText] = useState('');

  // Check token expiration every time app loads
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      if (Date.now() > expiry) {
        logout();
      }
    };
    checkTokenExpiration();
  }, []);

  const handleLogin = (token, username) => {
    setToken(token);
    setUsername(username);
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  const handlePredict = async () => {
    const response = await fetch('http://localhost:5000/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ text: inputText })
    });

    if (response.status === 401) {
      alert('Session expired. Please log in again.');
      logout();
      return;
    }

    const data = await response.json();
    setPrediction(data.prediction);
  };

  return (
    <div className="App">
      <h1>AI Prediction App</h1>
      {!token ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <p>Welcome, {username} <button onClick={logout}>Logout</button></p>
          <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Enter text" />
          <button onClick={handlePredict}>Predict</button>
          <p>Prediction: {prediction}</p>
        </>
      )}
    </div>
  );
}

export default App;
