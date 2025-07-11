import axios from 'axios';
import { getIdToken, onAuthStateChanged, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase/firebase.init';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await getIdToken(currentUser);
        localStorage.setItem('access-token', token);

        // Get extra user details (role, status) from MongoDB
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${currentUser.email}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setRole(res.data?.role);
        setUser(currentUser);
      } else {
        localStorage.removeItem('access-token');
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, role, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};


export default AuthProvider;