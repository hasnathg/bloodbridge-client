import axios from 'axios';
import { createUserWithEmailAndPassword, getIdToken, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase/firebase.init';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  /** ✅ Register User with Firebase */
  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  /** ✅ Login User */
  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  /** ✅ Update Firebase Profile */
  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  /** ✅ Logout */
  const logoutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  /**
   * ✅ Auth State Observer
   * Runs whenever user logs in or logs out
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (currentUser) {
        try {
          // Refresh user info
          await currentUser.reload();
          const freshUser = auth.currentUser;

          console.log('✅ Auth state changed:', freshUser);

          // Get Firebase ID Token
          const token = await getIdToken(freshUser, true);

          // ✅ Save user in backend if not exists
          try {
  await axios.post(
    `${import.meta.env.VITE_API_URL}/users`,
    {
      name: freshUser.displayName,
      email: freshUser.email,
      avatar: freshUser.photoURL,
      role: 'donor', // Default role
      status: 'active',
      createdAt: new Date(),
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
} catch (err) {
  // ✅ Ignore 409 Conflict (user already exists), log other errors
  if (err.response?.status !== 409) {
    console.error("❌ Error saving user:", err.response?.data || err.message);
  }
}


          // ✅ Get user role from backend
          try {
            const res = await axios.get(
              `${import.meta.env.VITE_API_URL}/users/${freshUser.email}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setRole(res.data?.role || 'donor');
          } catch (err) {
            console.error('❌ Failed to fetch role:', err);
            setRole(null);
          }

          setUser(freshUser);
        } catch (err) {
          console.error('❌ Error in Auth State:', err);
          setUser(null);
          setRole(null);
        }
      } else {
        // No user logged in
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
    setUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [role, setRole] = useState(null);

//   const registerUser = (email, password) => {
//     setLoading(true);
//     return createUserWithEmailAndPassword(auth, email, password);
//   };

//    const loginUser = (email, password) => {
//     setLoading(true);
//     return signInWithEmailAndPassword(auth, email, password);
//   };

//    const updateUserProfile = (name, photo) => {
//     return updateProfile(auth.currentUser, {
//       displayName: name,
//       photoURL: photo,
//     });
//   };

//   const logoutUser = () => {
//     setLoading(true);
//     return signOut(auth);
//   };


// useEffect(() => {
//   const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//     setLoading(true);

//     if (currentUser) {
//       await currentUser.reload();
//       const freshUser = auth.currentUser;

//       console.log("✅ Auth state changed:", freshUser);

//       try {
//         const token = await getIdToken(freshUser);
//         // ✅ No localStorage
//         const res = await axios.get(
//           `${import.meta.env.VITE_API_URL}/users/${freshUser.email}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setRole(res.data?.role || null);
//       } catch {
//         setRole(null);
//       }

//       setUser(freshUser);
//     } else {
//       setUser(null);
//       setRole(null);
//     }

//     setLoading(false);
//   });

//   return () => unsubscribe();
// }, []);



// const authInfo = {
//     user,
//     loading,
//     role,
//     registerUser,
//     loginUser,
//     logoutUser,
//     updateUserProfile,
//     setUser,
//   };

//   return (
//     <AuthContext.Provider value={authInfo}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// export default AuthProvider;