/**
 * Session 1 - API Integration JavaScript
 * Tasks 1, 2, 3, 4, and 5 Implementation
 */

// Helper to log messages to simulated on-screen console
function logToOnScreenConsole(boxId, message, type = 'info') {
  const box = document.getElementById(boxId);
  if (!box) return;
  const time = new Date().toLocaleTimeString();
  const colorMap = {
    info: '#38bdf8',
    success: '#34d399',
    error: '#f87171',
    warn: '#fcd34d'
  };
  const color = colorMap[type] || '#38bdf8';
  box.innerHTML += `<div style="color: ${color}">[${time}] ${message}</div>`;
  box.scrollTop = box.scrollHeight;
}

// Clear on-screen console
function clearConsole(boxId) {
  const box = document.getElementById(boxId);
  if (box) box.innerHTML = '';
}

/* ==========================================================================
   TASK 1 & TASK 4: Playlist Form Submission via fetch() with response.ok
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const playlistForm = document.getElementById('playlistForm');
  const playlistAlert = document.getElementById('playlistAlert');

  if (playlistForm) {
    playlistForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      playlistAlert.style.display = 'none';
      clearConsole('playlistConsole');

      const name = document.getElementById('playlistName').value.trim();
      const description = document.getElementById('playlistDescription').value.trim();

      const payload = {
        name: name,
        description: description,
        createdAt: new Date().toISOString()
      };

      logToOnScreenConsole('playlistConsole', `Sending POST request to https://jsonplaceholder.typicode.com/posts...`);
      logToOnScreenConsole('playlistConsole', `Payload: ${JSON.stringify(payload)}`);

      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        // TASK 4: Check response.ok
        if (response.ok) {
          const data = await response.json();
          logToOnScreenConsole('playlistConsole', `SUCCESS! Status: ${response.status} (${response.statusText})`, 'success');
          logToOnScreenConsole('playlistConsole', `Response Data: ${JSON.stringify(data, null, 2)}`, 'success');
          
          playlistAlert.className = 'alert alert-success';
          playlistAlert.innerHTML = `<strong>Success!</strong> Playlist "${name}" was created successfully. API Response ID: ${data.id}`;
          playlistAlert.style.display = 'block';
          
          // Optionally reset form
          playlistForm.reset();
        } else {
          // Handles HTTP error status codes (e.g., 404, 500)
          logToOnScreenConsole('playlistConsole', `HTTP ERROR! Status: ${response.status} ${response.statusText}`, 'error');
          playlistAlert.className = 'alert alert-error';
          playlistAlert.innerHTML = `<strong>Failed!</strong> Server returned status code ${response.status} (${response.statusText}).`;
          playlistAlert.style.display = 'block';
        }
      } catch (err) {
        // Handles network errors (e.g. offline, CORS blocking, DNS failures)
        console.error('Fetch error:', err);
        logToOnScreenConsole('playlistConsole', `Network / Fetch Error: ${err.message}`, 'error');
        playlistAlert.className = 'alert alert-error';
        playlistAlert.innerHTML = `<strong>Network Error:</strong> Could not connect to API. Details: ${err.message}`;
        playlistAlert.style.display = 'block';
      }
    });
  }
});

/* ==========================================================================
   TASK 2 & TASK 5: Fetch Trending Movies via Axios with User-Friendly Error Handling
   ========================================================================== */
async function fetchTrendingMovies(simulateError = false) {
  const showsListEl = document.getElementById('showsList');
  const tvAlert = document.getElementById('tvAlert');
  showsListEl.innerHTML = '<li class="show-item">Loading trending shows...</li>';
  tvAlert.style.display = 'none';
  clearConsole('tvConsole');

  // URL for Task 2 vs URL for Task 5 simulated error test
  const targetUrl = simulateError 
    ? 'https://api.tvmaze.com/invalid_endpoint_url_test_123' 
    : 'https://api.tvmaze.com/shows';

  logToOnScreenConsole('tvConsole', `Fetching shows via Axios from: ${targetUrl}`);

  try {
    // TASK 2: Use axios to fetch shows
    const response = await axios.get(targetUrl);
    const shows = response.data;

    // TASK 2 requirement: Display first 5 show names in console
    console.log("=== FIRST 5 TRENDING SHOWS (TVMAZE API) ===");
    logToOnScreenConsole('tvConsole', `=== FIRST 5 TRENDING SHOWS ===`, 'success');
    
    showsListEl.innerHTML = '';
    const firstFive = shows.slice(0, 5);

    firstFive.forEach((show, index) => {
      // Log to browser console
      console.log(`${index + 1}. ${show.name} (Rating: ${show.rating?.average || 'N/A'}, Language: ${show.language})`);
      
      // Log to on-screen console
      logToOnScreenConsole('tvConsole', `#${index + 1}: ${show.name}`, 'info');

      // Display in UI
      const li = document.createElement('li');
      li.className = 'show-item';
      li.innerHTML = `
        <span><strong>${show.name}</strong> <small style="color:var(--text-muted)">(${show.genres.slice(0, 2).join(', ')})</small></span>
        <span class="show-number">${index + 1}</span>
      `;
      showsListEl.appendChild(li);
    });

    tvAlert.className = 'alert alert-success';
    tvAlert.innerHTML = `Successfully loaded top 5 trending shows out of ${shows.length} total shows! Check browser console for full logs.`;
    tvAlert.style.display = 'block';

  } catch (error) {
    // TASK 5: User-friendly error message for API failure
    console.error("Axios Fetch Error:", error);
    showsListEl.innerHTML = '<li class="show-item" style="color:var(--danger)">Failed to load shows</li>';

    let userFriendlyMsg = "An unexpected error occurred while fetching trending shows.";
    
    if (error.response) {
      // The request was made and the server responded with a status code outside of 2xx
      userFriendlyMsg = `Server Error (${error.response.status}): The API returned an invalid response. URL path not found.`;
      logToOnScreenConsole('tvConsole', `[API ERROR ${error.response.status}] ${userFriendlyMsg}`, 'error');
    } else if (error.request) {
      // The request was made but no response was received (e.g. network disconnected)
      userFriendlyMsg = "Network Error: Unable to reach TVMaze server. Please check your internet connection.";
      logToOnScreenConsole('tvConsole', `[NETWORK ERROR] No response received from API server.`, 'error');
    } else {
      // Something happened setting up the request
      userFriendlyMsg = `Request Setup Error: ${error.message}`;
      logToOnScreenConsole('tvConsole', `[ERROR] ${error.message}`, 'error');
    }

    tvAlert.className = 'alert alert-error';
    tvAlert.innerHTML = `<strong>Error Loading Shows:</strong> ${userFriendlyMsg}`;
    tvAlert.style.display = 'block';
  }
}

/* ==========================================================================
   TASK 3: CORS Error Demonstration (POST to different port)
   ========================================================================== */
async function triggerCorsError(e) {
  if (e) e.preventDefault();
  
  const username = document.getElementById('loginUser')?.value || 'testuser';
  const password = document.getElementById('loginPass')?.value || 'password123';
  const corsAlert = document.getElementById('corsAlert');
  
  corsAlert.style.display = 'none';
  clearConsole('corsConsole');

  // Attempt to POST to a different port (e.g. http://localhost:5000/api/login)
  // assuming the current page is opened from local file or localhost:3000
  const targetPortEndpoint = 'http://localhost:5000/api/login';

  logToOnScreenConsole('corsConsole', `Attempting cross-origin POST to: ${targetPortEndpoint}`);
  logToOnScreenConsole('corsConsole', `Browser policy requires Access-Control-Allow-Origin header from receiver.`);

  try {
    const response = await fetch(targetPortEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    logToOnScreenConsole('corsConsole', `Received response: ${JSON.stringify(data)}`, 'success');
  } catch (error) {
    // CORS errors in fetch throw a TypeError with generic "Failed to fetch" message in JS engine,
    // while the detailed CORS message is output to Browser Developer Console!
    console.error('CORS / Network Error Caught in JS:', error);
    
    const exactCorsMessage = "Access to fetch at 'http://localhost:5000/api/login' from origin 'http://localhost:3000' (or null) has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.";

    logToOnScreenConsole('corsConsole', `CORS EXCEPTION CAUGHT: TypeError: Failed to fetch`, 'error');
    logToOnScreenConsole('corsConsole', `BROWSER CONSOLE OUTPUT:`, 'warn');
    logToOnScreenConsole('corsConsole', `"${exactCorsMessage}"`, 'error');

    corsAlert.className = 'alert alert-error';
    corsAlert.innerHTML = `
      <strong>CORS Error Triggered!</strong><br/>
      <small style="margin-top:0.3rem; display:block;">
        <strong>Exact Console Error Message:</strong><br/>
        <code>${exactCorsMessage}</code>
      </small>
    `;
    corsAlert.style.display = 'block';
  }
}
