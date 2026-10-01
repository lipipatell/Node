import React, { useState, useEffect } from 'react';

export default function RestaurantSection({ backendUrl, onError }) {
  const [name, setName] = useState('');
  const [cuisine, setCuisine] = useState('Italian');
  const [rating, setRating] = useState('4.5');
  const [restaurants, setRestaurants] = useState([]);
  const [latestSaved, setLatestSaved] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/restaurants`);
      const data = await res.json();
      if (res.ok && data.success) {
        setRestaurants(data.restaurants || []);
      }
    } catch (err) {
      console.error('Failed to load restaurants:', err);
    }
  };

  // TASK 2: Submit restaurant data to Node backend, save to MongoDB & return saved object to display
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg(null);
    setLoading(true);

    try {
      const payload = {
        name,
        cuisine,
        rating: parseFloat(rating)
      };

      const res = await fetch(`${backendUrl}/api/restaurants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // TASK 2 requirement: Return saved restaurant object to display on frontend
        setLatestSaved(data.restaurant);
        setStatusMsg({
          type: 'success',
          text: `Restaurant "${data.restaurant.name}" saved! Mongo ID: ${data.restaurant._id}`
        });

        setName('');
        setRating('4.5');
        fetchRestaurants(); // Refresh list
      } else {
        // TASK 4: Error handling
        const errorText = data.message || 'Failed to save restaurant in MongoDB.';
        setStatusMsg({ type: 'error', text: errorText });
        if (onError) onError(errorText);
      }
    } catch (err) {
      // TASK 4: Error handling
      const errorText = `Server Connection Error: ${err.message}`;
      setStatusMsg({ type: 'error', text: errorText });
      if (onError) onError(errorText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="card-box">
      <div class="card-header-flex">
        <h3 class="card-heading">🍕 Task 2: Add Restaurant</h3>
        <span class="pill" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
          POST /api/restaurants
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <div class="form-field">
          <label class="form-label">Restaurant Name</label>
          <input
            type="text"
            class="form-input"
            placeholder="e.g. Mario's Trattoria"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div class="form-field">
            <label class="form-label">Cuisine</label>
            <select class="form-select" value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
              <option value="Italian">Italian 🍝</option>
              <option value="Japanese">Japanese 🍣</option>
              <option value="Indian">Indian 🍛</option>
              <option value="Mexican">Mexican 🌮</option>
              <option value="American">American 🍔</option>
              <option value="French">French 🥐</option>
            </select>
          </div>

          <div class="form-field">
            <label class="form-label">Rating (0 - 5 ⭐)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              class="form-input"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" class="btn-action btn-emerald" disabled={loading}>
          {loading ? 'Saving to Database...' : 'Save Restaurant (Return Saved Object)'}
        </button>
      </form>

      {statusMsg && (
        <div class={`alert-banner ${statusMsg.type}`}>
          {statusMsg.text}
        </div>
      )}

      {/* TASK 2: Highlight returned saved restaurant object */}
      {latestSaved && (
        <div style={{
          marginTop: '1rem',
          padding: '0.8rem 1rem',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px dashed rgba(16, 185, 129, 0.4)',
          borderRadius: '8px',
          fontSize: '0.85rem'
        }}>
          <strong style={{ color: '#34d399' }}>Returned Saved Object from Backend:</strong>
          <pre style={{
            marginTop: '0.4rem',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.78rem',
            color: '#a7f3d0',
            overflowX: 'auto'
          }}>
            {JSON.stringify(latestSaved, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '1.25rem' }}>
        <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
          Restaurants Collection ({restaurants.length})
        </h4>
        <div class="data-list">
          {restaurants.map((rest) => (
            <div key={rest._id} class="data-item">
              <div>
                <div class="data-title">{rest.name}</div>
                <div class="data-meta">{rest.cuisine} Cuisine</div>
              </div>
              <span class="pill pill-star">⭐ {rest.rating}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
