import { useState, useEffect } from 'react';
import MovieDetails from './movieDetails';

// Hecho con ayuda de ChatGPT. Componente se va a hidratar en el lado del cliente una vez empiece a escribir el input
const MovieInfo = ({ initialMovies }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState(initialMovies);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(initialMovies.length);
  const [selectedMovie, setSelectedMovie] = useState(null);
  

  useEffect(() => {
    const fetchMovies = async () => {
      if (searchTerm) {
        setLoading(true);
        const url = `https://www.omdbapi.com/?apikey=f51532e8&s=${encodeURIComponent(searchTerm)}&type=movie&page=${currentPage}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data.Search) {
            setMovies(data.Search);
            setTotalResults(parseInt(data.totalResults, 10));
          } else {
            setMovies([]);
            setTotalResults(0);
          }
        } catch (error) {
          console.error('Error fetching movies:', error);
          setMovies([]);
          setTotalResults(0);
        } finally {
          setLoading(false);
        }
      } else {
        setMovies(initialMovies);
        setTotalResults(initialMovies.length);
      }
    };

    const timeoutId = setTimeout(fetchMovies, 500);
    return () => clearTimeout(timeoutId);

  }, [searchTerm, currentPage, initialMovies]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchMovieDetails = async (imdbID) => {
    setLoading(true);
    const url = `https://www.omdbapi.com/?apikey=f51532e8&i=${imdbID}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSelectedMovie(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (imdbID) => {
    fetchMovieDetails(imdbID);
  };

  const handleBackToList = () => {
    setSelectedMovie(null);
  };


  if (selectedMovie) {
    return <MovieDetails movie={selectedMovie} onClose={handleBackToList} />;
  }

  const handleNextPage = () => {
    if ((currentPage * 10) < totalResults) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a movie..."
      />
      {loading ? <p>Loading...</p> : (
        <>
          <ul>
            {movies.map((movie, index) => (
              <li key={index} onClick={() => handleMovieClick(movie.imdbID)} style={{ cursor: 'pointer' }}>
                <h2>{movie.Title} ({movie.Year})</h2>
                <img src={movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/150'} alt={`Poster of ${movie.Title}`} style={{ width: '100px' }} />
              </li>
            ))}
          </ul>
          <div>
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
            <button onClick={handleNextPage} disabled={(currentPage * 10) >= totalResults}>Next</button>
            <span>Page {currentPage} of {Math.ceil(totalResults / 10)}</span>
          </div>
        </>
      )}
      {movies.length === 0 && !loading && searchTerm && <p>No movies found. Try another search.</p>}
    </div>
  );
};

export default MovieInfo;
