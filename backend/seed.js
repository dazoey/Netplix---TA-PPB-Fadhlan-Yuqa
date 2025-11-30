require('dotenv').config();
const axios = require('axios');
const supabase = require('./supabaseClient');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

if (!TMDB_API_KEY) {
  throw new Error('TMDB_API_KEY is required. Please add it to your .env file.');
}

// Function to fetch all genres from TMDB
const fetchGenres = async () => {
  try {
    console.log('Fetching genres from TMDB...');
    const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
      params: { api_key: TMDB_API_KEY },
    });
    console.log('Successfully fetched genres.');
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres from TMDB:', error.message);
    return null;
  }
};

// Function to fetch popular movies from TMDB (multiple pages)
const fetchPopularMovies = async (pages = 5) => {
  try {
    console.log(`Fetching ${pages} pages of popular movies...`);
    let movies = [];
    for (let i = 1; i <= pages; i++) {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        params: { api_key: TMDB_API_KEY, page: i },
      });
      movies = movies.concat(response.data.results);
      process.stdout.write(`Fetched page ${i}/${pages}\r`);
    }
    console.log('\nSuccessfully fetched popular movies.');
    return movies;
  } catch (error) {
    console.error('Error fetching popular movies from TMDB:', error.message);
    return null;
  }
};

const seedDatabase = async () => {
  console.log('Starting database seed process...');

  // 1. Seed Genres
  const genres = await fetchGenres();
  if (genres) {
    const formattedGenres = genres.map(g => ({ id: g.id, name: g.name }));
    const { error } = await supabase.from('genres').upsert(formattedGenres, { onConflict: 'id' });
    if (error) {
      console.error('Error seeding genres:', error.message);
    } else {
      console.log('Successfully seeded genres table.');
    }
  }

  // 2. Seed Movies and Join Table
  const movies = await fetchPopularMovies();
  if (movies) {
    // --- FIX: De-duplicate movies before upserting ---
    const uniqueMovies = new Map();
    movies.forEach(movie => {
      uniqueMovies.set(movie.id, movie);
    });
    const deDupedMovies = Array.from(uniqueMovies.values());

    const formattedMovies = deDupedMovies.map(m => ({
      id: m.id,
      title: m.title,
      overview: m.overview,
      poster_path: m.poster_path,
      backdrop_path: m.backdrop_path,
      release_date: m.release_date || null,
      vote_average: m.vote_average,
    }));

    // --- FIX: De-duplicate movie-genre relations ---
    const uniqueRelations = new Set();
    deDupedMovies.forEach(movie => {
      movie.genre_ids.forEach(genreId => {
        uniqueRelations.add(`${movie.id}-${genreId}`);
      });
    });
    const movieGenreRelations = Array.from(uniqueRelations).map(relation => {
      const [movieId, genreId] = relation.split('-');
      return { movie_id: parseInt(movieId, 10), genre_id: parseInt(genreId, 10) };
    });

    // Insert into 'movies' table
    const { error: moviesError } = await supabase.from('movies').upsert(formattedMovies, { onConflict: 'id' });
    if (moviesError) {
      console.error('Error seeding movies:', moviesError.message);
    } else {
      console.log('Successfully seeded movies table.');
    }

    // Insert into 'movie_genres' table
    const { error: relationsError } = await supabase.from('movie_genres').upsert(movieGenreRelations, { onConflict: 'movie_id,genre_id' });
    if (relationsError) {
      console.error('Error seeding movie_genres relations:', relationsError.message);
    } else {
      console.log('Successfully seeded movie_genres join table.');
    }
  }
  
  console.log('Database seed process finished.');
};

seedDatabase();
