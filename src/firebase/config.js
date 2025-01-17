import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Log environment variables for debugging
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
});

// Hardcoded config for testing
const firebaseConfig = {
  apiKey: "AIzaSyDAqieq7SssPjNBdgWIHS8l6cP0ipWhJ4Y",
  authDomain: "whisperjournal-bbe7d.firebaseapp.com",
  projectId: "whisperjournal-bbe7d",
  storageBucket: "whisperjournal-bbe7d.appspot.com",
  messagingSenderId: "245116053413",
  appId: "1:245116053413:web:b110438ae2408dc54a2a4c"
};

console.log('Firebase Config:', firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Get Firebase services
const db = getFirestore(app);
const storage = getStorage(app);

export { 
  app,
  auth,
  db,
  storage,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification
};
