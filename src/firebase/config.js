import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBs5uEJ3OUU8mfgJBHGrlp5risojR5MPj0",
  projectId: "whisperjournal-bbe7d",
  storageBucket: "whisperjournal-bbe7d.firebasestorage.app",
  messagingSenderId: "245116053413",
  appId: "1:245116053413:ios:c7a1efd467bd15cb4a2a4c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
