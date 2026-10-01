import React, { useState, useEffect } from 'react';

export default function MovieSection({ backendUrl, onError }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Fetch movies on mount
  useEffect(() => {
    fetchMovies();
  }, []);

  // TASK 3: Fetch endpoint /movies from Node backend
  const fetchMovies = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${backendUrl}/movies`);
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status} (${res.statusText})`);
      }
      const data = await res.json();
      
      // Ensure data is array
      if (Array.isArray(data)) {
        setMovies(data);
      } else if (data.movies) {
        setMovies(data.movies);
      } else {
        setMovies([]);
      }
    } catch (err) {
      // TASK 4: Error handling for movie fetch
      console.error('Error fetching movies:', err);
      const msg = `Failed to fetch movies from MongoDB: ${err.message}`;
      setErrorMsg(msg);
      if (onError) onError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="card-box">
      <div class="card-header-flex">
        <h3 class="card-heading">🎬 Task 3: Movie List Catalog</h3>
        <span class="pill" style={{ background: 'rgba(236, 72, 153, 0.2)', color: '#f472b6' }}>
          GET /movies
        </span>
      </div>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
        Fetches movie documents stored in MongoDB collection via Node backend endpoint <code>/movies</code> using async/await.
      </p>

      <button onClick={fetchMovies} class="btn-action btn-indigo" style={{ marginBottom: '1rem' }}>
        {loading ? 'Refreshing Movie List...' : 'Refresh Movie Catalog (GET /movies)'}
      </button>

      {errorMsg && (
        <div class="alert-banner error" style={{ marginBottom: '1rem' }}>
          {errorMsg}
        </div>
      )}

      <div class="data-list" style={{ maxHeight: '380px' }}>
        {movies.length === 0 && !loading ? (
          <div class="data-item" style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>
            No movie records found in database.
          </div>
        ) : (
          movies.map((movie) => (
            <div key={movie._id || movie.title} class="data-item">
              <div>
                <div class="data-title">
                  {movie.title} <small style={{ color: 'var(--text-dim)' }}>({movie.year})</small>
                </div>
                <div class="data-meta">
                  Genre: {movie.genre} • Director: {movie.director || 'N/A'}
                </div>
              </div>
              <span class="pill pill-star">⭐ {movie.rating}/10</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
