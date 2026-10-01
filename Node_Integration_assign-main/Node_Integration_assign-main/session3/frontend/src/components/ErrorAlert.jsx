import React from 'react';

export default function ErrorAlert({ errorMessage, onClose, onSimulateError }) {
  if (!errorMessage) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      left: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      zIndex: 9999,
      background: 'rgba(239, 68, 68, 0.95)',
      color: 'white',
      padding: '1rem 1.25rem',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '1rem',
      backdropFilter: 'blur(10px)',
      animation: 'slideDown 0.3s ease'
    }}>
      <div>
        <strong style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          🚨 Task 4 Error Handling Triggered:
        </strong>
        <p style={{ fontSize: '0.9rem', marginTop: '0.3rem', opacity: 0.95, lineHeight: 1.4 }}>
          {errorMessage}
        </p>
      </div>

      <button
        onClick={onClose}
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          color: 'white',
          padding: '0.3rem 0.6rem',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        ✕ Close
      </button>
    </div>
  );
}
