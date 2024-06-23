import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyB_8_47FnkwrcaCZ52xAQ2Ja4nFebvRvSo",
  authDomain: "astro-59f6f.firebaseapp.com",
  databaseURL: "https://astro-59f6f-default-rtdb.firebaseio.com",
  projectId: "astro-59f6f",
  storageBucket: "astro-59f6f.appspot.com",
  messagingSenderId: "760929329503",
  appId: "1:760929329503:web:81006170b70b9a13f3d6ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();


export { auth, provider, db };
