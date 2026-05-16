import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// Mocking Firebase config since it was deleted and setup was declined
const firebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "mock-project.firebaseapp.com",
  projectId: "mock-project",
  storageBucket: "mock-project.firebasestorage.app",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef",
  firestoreDatabaseId: "(default)"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
