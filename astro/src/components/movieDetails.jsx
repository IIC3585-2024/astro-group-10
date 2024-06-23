import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { addMovie, addComment} from './movieService';

const MovieDetails = ({ movie, onClose }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(1);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);


  const handleAdd = async () => {
    if (user) {
        console.log("User is authenticated, adding movie and comment");
      await addMovie(movie); // Asegúrate de que la película esté en la base de datos
      await addComment(movie.Title, comment, rating, user.email); // Agrega el comentario
      console.log(movie,movie.Title);
      setComment("");
      setRating(1);
      setIsAdded(true);
      alert("Movie and review added!");
    } else {
      alert("Please log in to add a movie and review.");
    }
  };

  if (!user) {
    return (
      <div>
        <p>Please log in to view movie details and add reviews.</p>
        <button onClick={onClose}>Back to list</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onClose}>Back to list</button>
      <h2>{movie.Title} ({movie.Year})</h2>
      <img src={movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/150'} alt={`Poster of ${movie.Title}`} />
      <p>{movie.Plot}</p>
      <p><strong>Genre:</strong> {movie.Genre}</p>
      <p><strong>Director:</strong> {movie.Director}</p>
      <p><strong>Actors:</strong> {movie.Actors}</p>
      <p><strong>Language:</strong> {movie.Language}</p>
      <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>

      {!isAdded && (
        <div>
          <h3>Add a Review</h3>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your comment here"></textarea>
          <div>
            <label>Rating: </label>
            <input type="number" value={rating} onChange={(e) => setRating(Number(e.target.value))} min="1" max="10" />
          </div>
          <button onClick={handleAdd} disabled={isAdded}>
            {isAdded ? "Added" : "Add to Selected Movies"}
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
