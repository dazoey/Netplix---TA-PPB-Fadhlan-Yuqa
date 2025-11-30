import React, { useEffect, useState } from 'react';
import { getMoviesByCategory } from '../api/api';
import './Row.css';

const Row = ({ title, category }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const movies = await getMoviesByCategory(category);
      setMovies(movies);
    };
    fetchData();
  }, [category]);

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row-posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            alt={movie.title || movie.name}
          />
        ))}
      </div>
    </div>
  );
};

export default Row;
