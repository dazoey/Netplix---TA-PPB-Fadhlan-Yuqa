import React, { useEffect, useState } from 'react';
import { getTrendingVideos } from '../api/api';  // Pastikan mengimpor getTrendingVideos
import './Banner.css';

const Banner = () => {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const trending = await getTrendingVideos();
      setMovie(trending[0]); // Ambil film pertama dari daftar trending
    };
    fetchData();
  }, []);

  if (!movie) return null;

  return (
    <div className="banner" style={{
      backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
    }}>
      <div className="banner-contents">
        <h1>{movie.title || movie.name}</h1>
        <p>{movie.overview}</p>
        <button>Play</button>
        <button>More Info</button>
      </div>
    </div>
  );
};

export default Banner;
