import { useEffect, useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const AuthButton = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div>
      {user ? (
        <button onClick={handleLogout} style={{ backgroundColor: 'red', color: 'white' }}>Logout</button>
      ) : (
        <button onClick={handleLogin} style={{ backgroundColor: 'green', color: 'white' }}>Login</button>
      )}
    </div>
  );
};

export default AuthButton;
