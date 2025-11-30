const dotenv = require('dotenv');
dotenv.config(); // Must be at the very top

const express = require('express');
const cors = require('cors');
const supabase = require('./supabaseClient'); // Import Supabase client

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Configuration
const whitelist = [
  'http://localhost:3000', // For local frontend development
  'https://netplix-ta-ppb-fadhlan-yuqa.vercel.app', // User's Vercel frontend
  // Add the future URL of your deployed backend service here if needed
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// API Routes
// Get trending movies
app.get('/api/movies/trending', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*, movie_genres(genre_id, genres(name))')
      .order('vote_average', { ascending: false })
      .limit(20); // Limit to top 20 trending

    if (error) throw error;

    // Flatten genre data for easier consumption by frontend
    const formattedData = data.map(movie => ({
      ...movie,
      genres: movie.movie_genres.map(mg => mg.genres.name)
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// HEALTH CHECK: Get total movie count (MUST BE BEFORE /:id)
app.get('/api/movies/count', async (req, res) => {
  try {
    const { count, error } = await supabase
      .from('movies')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    res.json({ movie_count: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get movie details by ID
app.get('/api/movies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*, movie_genres(genre_id, genres(name))')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Movie not found' });

    // Flatten genre data
    const formattedData = {
      ...data,
      genres: data.movie_genres.map(mg => mg.genres.name)
    };

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all genres
app.get('/api/genres', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('genres')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get movies by genre ID
app.get('/api/movies/genre/:genreId', async (req, res) => {
  const { genreId } = req.params;
  try {
    const { data, error } = await supabase
      .from('movie_genres')
      .select('movies(*, movie_genres(genre_id, genres(name)))')
      .eq('genre_id', genreId);

    if (error) throw error;
    
    // Flatten structure and genre data
    const formattedData = data.map(mg => ({
      ...mg.movies,
      genres: mg.movies.movie_genres.map(g => g.genres.name)
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
