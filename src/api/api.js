import axios from 'axios';

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

// Function to get trending movies from our backend
export const getTrendingVideos = async () => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/api/movies/trending`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trending movies from backend:", error);
    return [];
  }
};

// Function to get movies by category (simplified to trending for now)
export const getMoviesByCategory = async (category) => {
  // In a full implementation, you'd add specific backend endpoints for categories
  // like 'popular', 'top_rated', etc., and map them here.
  // For now, we'll return trending for any category to keep the app functional.
  console.warn(`Category '${category}' requested. Returning trending movies from backend as a placeholder.`);
  return getTrendingVideos();
};

// Function to get movie details by ID from our backend
export const getMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/api/movies/${movieId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId} from backend:`, error);
    return null;
  }
};

// Function to get Marvel movies (simplified to trending for now)
export const getMarvelMovies = async () => {
    // Similar to categories, if frontend specifically needs 'Marvel' movies,
    // a backend endpoint or client-side filtering would be needed.
    // Returning trending for now.
    console.warn("Marvel movies requested. Returning trending movies from backend as a placeholder.");
    return getTrendingVideos();
};

// You might also want a function to get genres from the backend if needed by frontend
export const getGenres = async () => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/api/genres`);
    return response.data;
  } catch (error) {
    console.error("Error fetching genres from backend:", error);
    return [];
  }
};

// Function to get movies by genre ID from our backend
export const getMoviesByGenreId = async (genreId) => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/api/movies/genre/${genreId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movies for genre ID ${genreId} from backend:`, error);
    return [];
  }
};
