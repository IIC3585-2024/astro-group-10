import { useEffect, useState, useRef } from 'react';
import { getAllMovies } from './movieService';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Hecho con ayuda de ChatGPT
const SelectedMovies = () => {
  const [movies, setMovies] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState({});
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const highlightInterval = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        const allMovies = await getAllMovies();
        setMovies(allMovies);
        setFilteredMovies(allMovies);
      } catch (e) {
        console.error("Error fetching all movies:", e);
      }
    };

    fetchAllMovies();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredMovies(movies);
    } else {
      const filtered = Object.keys(movies)
        .filter(title => title.toLowerCase().includes(searchTerm.toLowerCase()))
        .reduce((res, key) => (res[key] = movies[key], res), {});
      setFilteredMovies(filtered);
    }
  }, [searchTerm, movies]);

  useEffect(() => {
    highlightInterval.current = setInterval(() => {
      setHighlightedIndex(prevIndex => (prevIndex + 1) % Object.keys(filteredMovies).length);
    }, 2000);

    return () => {
      clearInterval(highlightInterval.current);
    };
  }, [filteredMovies]);

  
  if (!user) {
    return (
      <div>
        <h2>Please log in to view the selected movies.</h2>
      </div>
    );
  }

  return (
    <div>
      <h2 className="movie-list-title">Movie List</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a movie..."
        className="search-input"
      />
      <div className="movies-container">
        {Object.keys(filteredMovies).map((movieTitle, index) => {
          const movie = filteredMovies[movieTitle];
          const comments = movie.comentarios ? Object.values(movie.comentarios) : [];
          const averageRating = comments.length > 0
            ? comments.reduce((sum, { valoracion }) => sum + valoracion, 0) / comments.length
            : 0;

          return (
            <div key={movieTitle} className={`movie-card ${index === highlightedIndex ? 'highlighted' : ''}`}>
              <div className="movie-info">
                <img src={movie.foto} alt={`Poster of ${movie.titulo}`} className="movie-poster" />
                <h3 className="movie-title">{movie.titulo}</h3>
              </div>
              <div className="movie-details">
                <p className="movie-description">{movie.descripcion}</p>
                <h4 className="comments-title">Comments</h4>
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div key={index} className="comment-card">
                      <p><strong>User:</strong> {comment.usuario}</p>
                      <p><strong>Rating:</strong> {comment.valoracion} <span className="star">⭐</span></p>
                      <p><strong>Comment:</strong> {comment.comentario}</p>
                    </div>
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}
                <h4 className="average-rating">Average Rating: {averageRating.toFixed(1)} <span className="star">⭐</span></h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectedMovies;
