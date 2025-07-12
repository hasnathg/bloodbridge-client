import axios from 'axios';
import { createUserWithEmailAndPassword, getIdToken, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase/firebase.init';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

   const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

   const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  const logoutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

 const createJWT = async (user) => {
  const token = await getIdToken(user);
  const res = await axios.post(`${import.meta.env.VITE_API_URL}/jwt`, { token });
  return res.data;
};

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setLoading(true);

    if (currentUser) {
      // 🔄 Reload to ensure displayName and photoURL are fresh
      await currentUser.reload();
      const freshUser = auth.currentUser;

      console.log("✅ Auth state changed - current user:", freshUser);

      const token = await getIdToken(freshUser);
      localStorage.setItem("access-token", token);

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${freshUser.email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRole(res.data?.role || null);
      } catch {
        setRole(null);
      }

      setUser(freshUser); // ✅ set fresh data
    } else {
      localStorage.removeItem("access-token");
      setUser(null);
      setRole(null);
    }

    setLoading(false);
  });

  return () => unsubscribe();
}, []);


const authInfo = {
    user,
    loading,
    role,
    registerUser,
    loginUser,
    logoutUser,
    updateUserProfile,
    createJWT,
    setUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};


export default AuthProvider;