import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword, // Add this import
  NextOrObserver,
  User
} from 'firebase/auth';
import { getFirebaseConfig } from './firebase-config';

const app = initializeApp(getFirebaseConfig());
const auth = getAuth(app);

export const signInUser = async (
  email: string, 
  password: string
): Promise<User | null> => {
  if (!email || !password) {
    throw new Error('Both email and password are required.');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Sign-in error:', error);
    throw error;
  }
};

// Add the registration function
export const registerUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<User | null> => {
  if (!email || !password) {
    throw new Error('Both email and password are required.');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const userStateListener = (callback: NextOrObserver<User>) => {
  return onAuthStateChanged(auth, callback);
};

export const SignOutUser = async () => await signOut(auth);

export default app;
