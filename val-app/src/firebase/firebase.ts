
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  NextOrObserver,
  User
} from 'firebase/auth';
// import { getFirebaseConfig } from './firebase-config';
console.log('API Key:', import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY);
console.log('Auth Domain:', import.meta.env.VITE_REACT_APP_FIREBASE_AUTH_DOMAIN);

const config = {
  apiKey: import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_REACT_APP_FIREBASE_APP_ID,
};
// console.log('Environment variables:', import.meta.env);

export function getFirebaseConfig() {
  // console.log('Config:', config); 

  if (!config || !config.apiKey) {
    throw new Error('No Firebase configuration object provided.' + '\n' +
    'Add your web app\'s configuration object to firebase-config.ts');
  } else {
    return config;
  }
}

const app = initializeApp(getFirebaseConfig());
const auth = getAuth(app);

export const signInUser = async (
  email: string, 
  password: string
) => {
  if (!email || !password) {
    throw new Error('Both email and password are required.');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error('Sign-in error:', error);
    throw error;
  }
};


export const userStateListener = (callback:NextOrObserver<User>) => {
  return onAuthStateChanged(auth, callback)
}

export const SignOutUser = async () => await signOut(auth);
