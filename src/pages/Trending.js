import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMarvelMovies } from '../api/api';  // Import the function to fetch movies
import './Trending.css';

const Trending = () => {
  const [marvelMovies, setMarvelMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarvelMovies = async () => {
      try {
        const movies = await getMarvelMovies();
        setMarvelMovies(movies);
      } catch (error) {
        setError('Failed to fetch Marvel movies. Please try again later.');
        console.error(error);
      }
    };

    fetchMarvelMovies();
  }, []);

  // Function to chunk movies into rows (groups of 5 for example)
  const chunkMovies = (movies, chunkSize) => {
    const result = [];
    for (let i = 0; i < movies.length; i += chunkSize) {
      result.push(movies.slice(i, i + chunkSize));
    }
    return result;
  };

  const chunkedMovies = chunkMovies(marvelMovies, 5); // Adjust the chunk size as needed

  return (
    <div className="trending-container">
      <h2 className="trending-title">Trending Movies</h2>
      
      {error && <p className="error-message">{error}</p>}

      {/* Map over the chunked movies and display each group as a row */}
      {chunkedMovies.map((row, index) => (
        <div key={index} className="trending-row">
          <div className="trending-movies">
            {row.map((movie) => (
              <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card-link">
                <div className="movie-card">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="movie-poster"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Trending;
