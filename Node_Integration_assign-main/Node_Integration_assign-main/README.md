# Node Integration & Full MERN Stack Assignment Solution

Complete solution covering **Session 1 (API Integration)**, **Session 2 (Postman Testing)**, and **Session 3 (Connecting Full MERN Flow)**.

---

## 📁 Project Directory Overview

```text
Node_Integration_assign/
├── session1/                              # Session 1: API Integration
│   ├── index.html                         # Interactive Dashboard for Fetch, Axios, CORS
│   ├── script.js                          # Fetch/Axios implementation, error handling
│   ├── styles.css                         # Glassmorphic UI styling
│   └── CORS_ERROR_OBSERVATION.md          # Task 3 CORS Error report & recorded message
│
├── session2/                              # Session 2: Postman API Testing
│   ├── FoodieApp_APIs.postman_collection.json # Exported v2.1.0 Postman collection
│   └── POSTMAN_GUIDE.md                   # Setup, requests overview & peer review guide
│
└── session3/                              # Session 3: Connecting Full MERN Flow
    ├── backend/                           # Node.js + Express + Mongoose Backend
    │   ├── models/
    │   │   ├── Playlist.js                # Task 1 Playlist Schema
    │   │   ├── Restaurant.js              # Task 2 Restaurant Schema
    │   │   └── Movie.js                   # Task 3 Movie Schema
    │   ├── server.js                      # Express server with async/await & error handling
    │   └── package.json
    └── frontend/                          # React + Vite Frontend App
        ├── src/
        │   ├── components/
        │   │   ├── PlaylistSection.jsx    # Task 1: Add Playlist Form
        │   │   ├── RestaurantSection.jsx  # Task 2: Add Restaurant Form
        │   │   ├── MovieSection.jsx       # Task 3: Movie Catalog View
        │   │   └── ErrorAlert.jsx         # Task 4: Error Banner & Alert
        │   ├── App.jsx                    # Main MERN Flow Dashboard
        │   ├── App.css
        │   └── main.jsx
        ├── package.json
        └── vite.config.js
```

---

## 🚀 SESSION 1 - API Integration

### Tasks Completed:
1. **Playlist Form Submission (`fetch()`)**:
   - Created form fields for `playlist name` and `description`.
   - Sends payload as JSON to `https://jsonplaceholder.typicode.com/posts` on form submit.
2. **Trending Movies via `axios`**:
   - Uses `axios.get('https://api.tvmaze.com/shows')`.
   - Displays the top 5 show names in browser console (`console.log`) and UI list.
3. **CORS Error Demonstration**:
   - Form submits POST request to `http://localhost:5000/api/login` across origins.
   - Recorded exact console error in `session1/CORS_ERROR_OBSERVATION.md`:
     > `Access to fetch at 'http://localhost:5000/api/login' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`
4. **Response Status Validation (`response.ok`)**:
   - Refactored `fetch()` in playlist form to check `response.ok` before reading data.
   - Shows green success banner when status is 2xx, red error alert when status is non-2xx.
5. **User-Friendly Axios Error Handling**:
   - Added `try/catch` and `error.response` / `error.request` conditionals for TVMaze API call.
   - Provides user-friendly alerts when network disconnects or API URL is invalid (demonstrable via "Simulate API Error" button).

### How to Run Session 1:
Simply open `session1/index.html` in any web browser (or serve with Live Server).

---

## 📬 SESSION 2 - Postman Testing

### Tasks Completed:
1. Created Postman collection named **`FoodieApp APIs`**.
2. Tested `GET https://jsonplaceholder.typicode.com/posts` -> verified status `200 OK` and response body array.
3. Tested `POST https://jsonplaceholder.typicode.com/users` -> sent JSON body (`name`, `email`), verified status `201 Created` and returned user object.
4. Saved 5 different requests (`GET`, `POST`, `PUT`, `DELETE`) with detailed descriptions explaining their purpose.
5. Exported collection as **`session2/FoodieApp_APIs.postman_collection.json`** for peer review.

### How to Import Postman Collection:
1. Open Postman -> Click **Import**.
2. Select `session2/FoodieApp_APIs.postman_collection.json`.
3. Run requests and verify status codes and responses.

---

## ⚡ SESSION 3 - Connecting Full MERN Flow

### Tasks Completed:
1. **MERN Playlist Flow (Task 1)**:
   - React form sends POST request to `/api/playlists` with new playlist name.
   - Backend saves to MongoDB using Mongoose schema and returns success message to frontend.
2. **MERN Restaurant Flow (Task 2)**:
   - React form sends POST request to `/api/restaurants` (name, cuisine, rating).
   - Backend saves in MongoDB collection & returns the saved restaurant object to display on frontend.
3. **MERN Movies GET Endpoint (Task 3)**:
   - Implemented `/movies` (and `/api/movies`) GET endpoint in Node backend.
   - Mongoose fetches all movie documents from MongoDB and returns JSON.
   - React frontend fetches endpoint on load and renders movie catalog cards.
4. **Comprehensive Error Handling (Task 4)**:
   - If database fails to connect or save operation throws an error, backend returns `{ success: false, message: "..." }`.
   - React frontend catches errors, displays alert banner, and triggers `window.alert()` notification.
   - Included "Test DB Error Alert" button in frontend UI to trigger simulated database failure.
5. **Async/Await Refactoring (Task 5)**:
   - All Mongoose queries (`new Model().save()`, `Model.find()`, `Model.countDocuments()`) in `backend/server.js` use `async/await` syntax wrapped in `try/catch` blocks.

### How to Run Session 3 (Full MERN Flow):

1. **Start Backend Server**:
   ```bash
   cd session3/backend
   npm install
   npm start
   ```
   *(Backend runs on `http://localhost:5000`. Includes automatic `mongodb-memory-server` fallback if local MongoDB is not running).*

2. **Start React Frontend**:
   ```bash
   cd session3/frontend
   npm install
   npm run dev
   ```
   *(Frontend runs on `http://localhost:3000`).*
