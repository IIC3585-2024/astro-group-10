import {ref, set, push, get, child } from "firebase/database";
import { db } from '../firebase';

const addMovie = async (movie) => {
  const dbRef = ref(db);
  try {
    console.log("Attempting to add movie:", movie);
    const movieRef = child(dbRef, `movies/${movie.Title}`);
    const movieSnapshot = await get(movieRef);

    if (!movieSnapshot.exists()) {
      await set(movieRef, {
        titulo: movie.Title,
        descripcion: movie.Plot,
        foto: movie.Poster,
      });
      console.log("Movie added:", movie.Title);
    } else {
      console.log("Movie already exists:", movie.Title);
    }
  } catch (e) {
    console.error("Error adding document: ", e);
    alert(`Error adding movie: ${e.message}`);
  }
};

const addComment = async (movieTitle, comment, rating, user) => {
  try {
    console.log("Attempting to add comment:", { movieTitle, comment, rating, user });
    const commentsRef = ref(db, `movies/${movieTitle}/comentarios`);
    await push(commentsRef, {
      comentario: comment,
      valoracion: rating,
      usuario: user
    });
    console.log("Comment added for movie:", movieTitle);
  } catch (e) {
    console.error("Error adding comment: ", e);
    alert(`Error adding comment: ${e.message}`);
  }
};

const getMovieDetails = async (movieTitle) => {
  const dbRef = ref(db);
  try {
    const movieSnapshot = await get(child(dbRef, `movies/${movieTitle}`));
    if (movieSnapshot.exists()) {
      const movieData = movieSnapshot.val();
      return movieData;
    } else {
      console.log("No data available for this movie.");
      return null;
    }
  } catch (e) {
    console.error("Error getting movie details: ", e);
    return null;
  }
};

export { addMovie, addComment, getMovieDetails };
