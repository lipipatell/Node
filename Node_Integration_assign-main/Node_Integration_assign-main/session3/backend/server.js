/**
 * Session 3 - MERN Flow Backend Server
 * Express + Mongoose + Async/Await
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Playlist = require('./models/Playlist');
const Restaurant = require('./models/Restaurant');
const Movie = require('./models/Movie');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// State variable to track MongoDB connection status
let isDbConnected = false;

// Async function to connect to MongoDB with automatic Memory Server fallback
async function connectDB() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodie_mern';
  
  try {
    console.log(`Connecting to MongoDB at: ${mongoURI}...`);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    isDbConnected = true;
    console.log('✅ MongoDB connected successfully to local daemon!');
    await seedInitialMovies();
  } catch (err) {
    console.warn('⚠️ Local MongoDB connection failed or timeout. Starting MongoMemoryServer fallback...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      isDbConnected = true;
      console.log(`✅ Connected to MongoMemoryServer in-memory DB at: ${uri}`);
      await seedInitialMovies();
    } catch (memErr) {
      console.error('❌ Failed to start MongoMemoryServer:', memErr.message);
      isDbConnected = false;
    }
  }
}

// Seed initial movie data if collection is empty
async function seedInitialMovies() {
  try {
    const count = await Movie.countDocuments();
    if (count === 0) {
      console.log('Seeding initial movie records into MongoDB...');
      await Movie.insertMany([
        { title: 'Inception', genre: 'Sci-Fi', rating: 8.8, year: 2010, director: 'Christopher Nolan' },
        { title: 'Interstellar', genre: 'Sci-Fi', rating: 8.7, year: 2014, director: 'Christopher Nolan' },
        { title: 'The Dark Knight', genre: 'Action', rating: 9.0, year: 2008, director: 'Christopher Nolan' },
        { title: 'Pulp Fiction', genre: 'Crime', rating: 8.9, year: 1994, director: 'Quentin Tarantino' },
        { title: 'Spirited Away', genre: 'Animation', rating: 8.6, year: 2001, director: 'Hayao Miyazaki' }
      ]);
      console.log('✅ Initial movie records seeded successfully!');
    }
  } catch (err) {
    console.error('Error seeding movies:', err.message);
  }
}

// Initialize Database Connection
connectDB();

/* ==========================================================================
   TASK 4 Middleware: Check Database Connection
   ========================================================================== */
app.use((req, res, next) => {
  // Allow health check and error simulation endpoints
  if (req.path === '/api/health' || req.path === '/api/simulate-error') {
    return next();
  }
  
  if (!isDbConnected || mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database connection failure: Unable to connect to MongoDB service.',
      error: 'MongoDB Service Unavailable'
    });
  }
  next();
});

/* ==========================================================================
   HEALTH & DIAGNOSTICS ENDPOINTS
   ========================================================================== */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    dbState: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date()
  });
});

// Endpoint to simulate backend database failure for Task 4 testing
app.post('/api/simulate-error', (req, res) => {
  res.status(500).json({
    success: false,
    message: 'SIMULATED ERROR: MongoDB save operation failed due to database write exception!',
    error: 'DatabaseWriteException'
  });
});

/* ==========================================================================
   TASK 1 & TASK 5: POST /api/playlists (Add Playlist with Async/Await)
   ========================================================================== */
app.post('/api/playlists', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Playlist name is required.'
      });
    }

    // TASK 5: Async/Await Mongoose operation
    const newPlaylist = new Playlist({
      name: name.trim(),
      description: description || 'No description provided'
    });

    const savedPlaylist = await newPlaylist.save();

    console.log(`[POST /api/playlists] Saved playlist: ${savedPlaylist.name}`);

    // TASK 1: Return success message to frontend
    res.status(201).json({
      success: true,
      message: `Playlist "${savedPlaylist.name}" saved successfully to MongoDB!`,
      playlist: savedPlaylist
    });
  } catch (error) {
    // TASK 4: Error handling for MERN flow
    console.error('Error in POST /api/playlists:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save playlist to MongoDB.',
      error: error.message
    });
  }
});

// GET /api/playlists - Retrieve all playlists
app.get('/api/playlists', async (req, res) => {
  try {
    const playlists = await Playlist.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      playlists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch playlists.',
      error: error.message
    });
  }
});

/* ==========================================================================
   TASK 2 & TASK 5: POST /api/restaurants (Add Restaurant with Async/Await)
   ========================================================================== */
app.post('/api/restaurants', async (req, res) => {
  try {
    const { name, cuisine, rating } = req.body;

    // Validation
    if (!name || !cuisine || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Name, cuisine, and rating fields are all required.'
      });
    }

    // TASK 5: Async/Await Mongoose operation
    const newRestaurant = new Restaurant({
      name: name.trim(),
      cuisine: cuisine.trim(),
      rating: Number(rating)
    });

    const savedRestaurant = await newRestaurant.save();

    console.log(`[POST /api/restaurants] Saved restaurant: ${savedRestaurant.name}`);

    // TASK 2: Return saved restaurant object to display on frontend
    res.status(201).json({
      success: true,
      message: 'Restaurant saved successfully!',
      restaurant: savedRestaurant
    });
  } catch (error) {
    // TASK 4: Error handling
    console.error('Error in POST /api/restaurants:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save restaurant in MongoDB collection.',
      error: error.message
    });
  }
});

// GET /api/restaurants - Fetch all restaurants
app.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      restaurants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurants.',
      error: error.message
    });
  }
});

/* ==========================================================================
   TASK 3 & TASK 5: GET /movies (Fetch all movies with Async/Await)
   ========================================================================== */
// Support both /movies and /api/movies endpoints
const getMoviesHandler = async (req, res) => {
  try {
    // TASK 5: Use async/await for Mongoose find() query
    const movies = await Movie.find().sort({ rating: -1 });

    console.log(`[GET /movies] Fetched ${movies.length} movies from MongoDB.`);

    // TASK 3: Return movie documents as JSON
    res.status(200).json(movies);
  } catch (error) {
    // TASK 4: Error handling
    console.error('Error fetching movies from MongoDB:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movies from MongoDB database.',
      error: error.message
    });
  }
};

app.get('/movies', getMoviesHandler);
app.get('/api/movies', getMoviesHandler);

// POST /api/movies - Add a new movie
app.post('/api/movies', async (req, res) => {
  try {
    const { title, genre, rating, year, director } = req.body;
    const movie = new Movie({ title, genre, rating, year, director });
    const savedMovie = await movie.save();
    res.status(201).json({
      success: true,
      movie: savedMovie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add movie.',
      error: error.message
    });
  }
});

/* ==========================================================================
   Global Error Handling Middleware
   ========================================================================== */
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 FoodieApp Backend Server running on port http://localhost:${PORT}`);
});
