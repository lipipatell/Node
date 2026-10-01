import React, { useState, useEffect } from 'react';
import './App.css';
import PlaylistSection from './components/PlaylistSection';
import RestaurantSection from './components/RestaurantSection';
import MovieSection from './components/MovieSection';
import ErrorAlert from './components/ErrorAlert';

export default function App() {
  const [backendUrl, setBackendUrl] = useState('http://localhost:5000');
  const [dbConnected, setDbConnected] = useState(false);
  const [activeError, setActiveError] = useState(null);

  // Health check to verify database and server status
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, [backendUrl]);

  const checkHealth = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/health`);
      if (res.ok) {
        const data = await res.json();
        setDbConnected(data.dbState === 'Connected');
      } else {
        setDbConnected(false);
      }
    } catch {
      setDbConnected(false);
    }
  };

  // TASK 4: Error handling trigger - display browser alert and UI banner
  const handleError = (errorText) => {
    setActiveError(errorText);
    // Task 4 Requirement: Display an alert with the error
    window.alert(`🚨 MERN Flow Error Alert:\n\n${errorText}`);
  };

  // Simulate server/DB error for Task 4 testing
  const triggerSimulatedError = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/simulate-error`, { method: 'POST' });
      const data = await res.json();
      handleError(data.message || 'Simulated MongoDB Save Error');
    } catch (err) {
      handleError(`Network Error: Failed to reach backend at ${backendUrl}`);
    }
  };

  return (
    <div class="dashboard-container">
      {/* Global Error Banner */}
      <ErrorAlert
        errorMessage={activeError}
        onClose={() => setActiveError(null)}
      />

      <header class="dashboard-header">
        <span class="badge-tag">Session 3 • Full MERN Flow</span>
        <h1 class="dashboard-title">FoodieApp MERN Integration</h1>
        <p class="dashboard-subtitle">
          React Frontend + Node/Express Backend + MongoDB (Mongoose with Async/Await)
        </p>
      </header>

      {/* Connection Status Bar */}
      <div class="status-bar">
        <div class="status-indicator">
          <div class={`dot ${dbConnected ? '' : 'offline'}`}></div>
          <span>
            Node Backend: <strong style={{ color: '#818cf8' }}>{backendUrl}</strong> | 
            MongoDB Status: <strong style={{ color: dbConnected ? '#34d399' : '#fca5a5' }}>
              {dbConnected ? 'CONNECTED' : 'DISCONNECTED'}
            </strong>
          </span>
        </div>

        <button
          onClick={triggerSimulatedError}
          class="btn-action btn-rose"
          style={{ width: 'auto', padding: '0.4rem 1rem', fontSize: '0.85rem' }}
          title="Task 4: Test backend database failure and trigger error alert"
        >
          <span>Test DB Error Alert (Task 4)</span>
        </button>
      </div>

      {/* Grid of Tasks 1, 2, and 3 */}
      <div class="grid-3col">
        {/* TASK 1 & 5: Playlist Form */}
        <PlaylistSection
          backendUrl={backendUrl}
          onError={handleError}
        />

        {/* TASK 2 & 5: Restaurant Form */}
        <RestaurantSection
          backendUrl={backendUrl}
          onError={handleError}
        />

        {/* TASK 3 & 5: Movies Catalog */}
        <MovieSection
          backendUrl={backendUrl}
          onError={handleError}
        />
      </div>
    </div>
  );
}
