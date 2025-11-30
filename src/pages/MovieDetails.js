import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../api/api'; // Ganti sesuai dengan API yang digunakan
import './MovieDetail.css';

const MovieDetail = () => {
  const { movieId } = useParams(); // Mengambil movieId dari URL
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const data = await getMovieDetails(movieId); // Ambil data film berdasarkan ID
      setMovie(data);
    };
    fetchMovieDetails();
  }, [movieId]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="movie-detail">
      {/* Background Full */}
      <div
        className="movie-detail-background"
        style={{
          backgroundImage: `url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')`,
        }}
      >
        <div className="movie-detail-content">
          <h1 className="movie-title">{movie.title}</h1>
          <p className="movie-overview">{movie.overview}</p>
          {/* Tambahkan informasi lainnya sesuai kebutuhan */}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
