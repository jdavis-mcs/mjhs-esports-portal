import { createContext, useContext, useEffect, useState } from 'react';
// FIX: We now import 'getRoleFromEmail' instead of 'isSchoolEmail'
import { auth, db, googleProvider, getRoleFromEmail } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login Function
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // 1. Determine Role automatically based on email
      const detectedRole = getRoleFromEmail(user.email);

      // 2. Database Check
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new profile with the detected role
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: detectedRole, 
          createdAt: new Date(),
          stats: {} 
        });
        setUserRole(detectedRole);
      } else {
        // If they already exist, use the role in the database
        setUserRole(userSnap.data().role);
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.message);
    }
  };

  const logout = () => {
    setUserRole(null);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserRole(userSnap.data().role);
        }
      } else {
        setUserRole(null);
      }
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = { currentUser, userRole, loginWithGoogle, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};