import React, { useEffect, useState } from 'react';
import { getMoviesByCategory } from '../api/tmdb'; // Import API function to fetch movies by category
import { Link } from 'react-router-dom';
import './Home.css'; // Styling for Home page

const Home = () => {
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch movies by category
  useEffect(() => {
    const fetchMovies = async () => {
      const topRated = await getMoviesByCategory('top_rated');
      const popular = await getMoviesByCategory('popular');
      const upcoming = await getMoviesByCategory('upcoming');
      setTopRatedMovies(topRated);
      setPopularMovies(popular);
      setUpcomingMovies(upcoming);
      // Set a random featured movie from the top-rated movies
      setFeaturedMovie(topRated[Math.floor(Math.random() * topRated.length)]);
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (topRatedMovies.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % topRatedMovies.length);
      }, 5000); // Change movie every 5 seconds

      return () => clearInterval(intervalId);
    }
  }, [topRatedMovies]);
  // Update featured movie when currentIndex changes
  useEffect(() => {
    if (topRatedMovies.length > 0) {
      setFeaturedMovie(topRatedMovies[currentIndex]);
    }
  }, [currentIndex, topRatedMovies]);

  return (
    <div className="home-container">
      {/* Hero Section with Featured Movie */}
      {featuredMovie && (
        <div className="hero-section" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})` }}>
          <div className="hero-content">
            <h1 className="hero-title">{featuredMovie.title || featuredMovie.name}</h1>
            <p className="hero-description">{featuredMovie.overview}</p>
            <Link to={`/movie/${featuredMovie.id}`} className="hero-play-button">Play</Link>
          </div>
        </div>
      )}

      {/* Top Rated Movies */}
      <h2 className="home-title">Top Rated Movies</h2>
      <div className="home-movies-list">
        {topRatedMovies.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id} className="home-movie-item">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title || movie.name}
              className="home-movie-poster"
            />
          </Link>
        ))}
      </div>

      {/* Popular Movies */}
      <h2 className="home-title">Popular Movies</h2>
      <div className="home-movies-list">
        {popularMovies.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id} className="home-movie-item">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title || movie.name}
              className="home-movie-poster"
            />
          </Link>
        ))}
      </div>

      {/* Upcoming Movies */}
      <h2 className="home-title">Upcoming Movies</h2>
      <div className="home-movies-list">
        {upcomingMovies.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id} className="home-movie-item">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title || movie.name}
              className="home-movie-poster"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
