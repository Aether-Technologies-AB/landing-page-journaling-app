import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification
} from '../firebase/config';
import { doc, setDoc, getDoc, updateDoc, collection } from 'firebase/firestore';

const FirebaseContext = createContext();

export const useFirebase = () => {
  return useContext(FirebaseContext);
};

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get the latest user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const firestoreData = userDoc.data();
          
          // Update Auth profile if displayName is missing
          if (!user.displayName && firestoreData.displayName) {
            await updateProfile(user, {
              displayName: firestoreData.displayName
            });
          }
          
          setUserData(firestoreData);
        }
      } else {
        setUserData(null);
      }
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, additionalData = {}) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Auth profile with displayName
      await updateProfile(user, {
        displayName: additionalData.displayName
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: additionalData.displayName,
        createdAt: new Date().toISOString(),
        ...additionalData
      });

      // Send email verification
      await sendEmailVerification(user);

      return userCredential;
    } catch (error) {
      console.error('Error in signup:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Fetch user data after login
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        const firestoreData = userDoc.data();
        
        // Update Auth profile if displayName is missing
        if (!userCredential.user.displayName && firestoreData.displayName) {
          await updateProfile(userCredential.user, {
            displayName: firestoreData.displayName
          });
        }
        
        setUserData(firestoreData);
      }
      return userCredential;
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  };

  const logout = async () => {
    setUserData(null);
    return signOut(auth);
  };

  const resetPassword = async (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (profile) => {
    if (!auth.currentUser) throw new Error('No user logged in');
    
    try {
      // Update auth profile
      await updateProfile(auth.currentUser, {
        displayName: profile.displayName,
        photoURL: profile.photoURL
      });
      
      // Update Firestore document
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        displayName: profile.displayName,
        photoURL: profile.photoURL,
        updatedAt: new Date().toISOString()
      });

      // Fetch updated user data
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const updateUserData = async (data) => {
    if (!auth.currentUser) throw new Error('No user logged in');
    
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });

      // Fetch updated user data
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  const value = {
    user,
    userData,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    updateUserData
  };

  return (
    <FirebaseContext.Provider value={value}>
      {!loading && children}
    </FirebaseContext.Provider>
  );
};
