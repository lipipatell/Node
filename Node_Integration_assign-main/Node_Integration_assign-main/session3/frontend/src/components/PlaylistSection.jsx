import React, { useState, useEffect } from 'react';

export default function PlaylistSection({ backendUrl, onError }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [statusMsg, setStatusMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch existing playlists on mount
  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/playlists`);
      const data = await res.json();
      if (res.ok && data.success) {
        setPlaylists(data.playlists || []);
      }
    } catch (err) {
      console.error('Failed to load playlists:', err);
    }
  };

  // TASK 1: Submit new playlist to Node backend -> MongoDB via Mongoose
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg(null);
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/playlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // TASK 1: Show success message from backend
        setStatusMsg({
          type: 'success',
          text: data.message || `Playlist "${name}" saved to MongoDB!`
        });
        setName('');
        setDescription('');
        fetchPlaylists(); // Refresh list
      } else {
        // TASK 4: Error handling
        const errorText = data.message || 'Failed to save playlist to MongoDB.';
        setStatusMsg({ type: 'error', text: errorText });
        if (onError) onError(errorText);
      }
    } catch (err) {
      // TASK 4: Network/Server error handling
      const errorText = `Backend connection error: ${err.message}`;
      setStatusMsg({ type: 'error', text: errorText });
      if (onError) onError(errorText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="card-box">
      <div class="card-header-flex">
        <h3 class="card-heading">🎵 Task 1: Add Playlist</h3>
        <span class="pill">POST /api/playlists</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div class="form-field">
          <label class="form-label">Playlist Name</label>
          <input
            type="text"
            class="form-input"
            placeholder="e.g. Coding Lo-Fi Beats"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div class="form-field">
          <label class="form-label">Description</label>
          <textarea
            class="form-textarea"
            rows="2"
            placeholder="e.g. Relaxing beats for deep focus"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit" class="btn-action btn-indigo" disabled={loading}>
          {loading ? 'Saving to MongoDB...' : 'Save Playlist (MERN POST)'}
        </button>
      </form>

      {statusMsg && (
        <div class={`alert-banner ${statusMsg.type}`}>
          {statusMsg.text}
        </div>
      )}

      <div style={{ marginTop: '1.25rem' }}>
        <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
          Saved Playlists in MongoDB ({playlists.length})
        </h4>
        <div class="data-list">
          {playlists.length === 0 ? (
            <div class="data-item" style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>
              No playlists added yet. Submit the form above!
            </div>
          ) : (
            playlists.map((pl) => (
              <div key={pl._id} class="data-item">
                <div>
                  <div class="data-title">{pl.name}</div>
                  <div class="data-meta">{pl.description}</div>
                </div>
                <span class="pill" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  ID: {pl._id.slice(-4)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
