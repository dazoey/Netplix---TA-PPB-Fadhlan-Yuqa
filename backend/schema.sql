-- 1. Create the "movies" table
CREATE TABLE movies (
    id INT PRIMARY KEY,
    title TEXT NOT NULL,
    overview TEXT,
    poster_path VARCHAR(255),
    backdrop_path VARCHAR(255),
    release_date DATE,
    vote_average REAL
);

-- 2. Create the "genres" table
CREATE TABLE genres (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- 3. Create the join table "movie_genres" for the many-to-many relationship
CREATE TABLE movie_genres (
    movie_id INT REFERENCES movies(id) ON DELETE CASCADE,
    genre_id INT REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
);

-- Optional: Add indexes for faster lookups on the join table
CREATE INDEX idx_movie_genres_movie_id ON movie_genres(movie_id);
CREATE INDEX idx_movie_genres_genre_id ON movie_genres(genre_id);
