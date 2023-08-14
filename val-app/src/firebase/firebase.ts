import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User, // Update the import to include 'User'
  NextOrObserver,
  updateProfile
} from 'firebase/auth';
import { getFirebaseConfig } from './firebase-config';

const app = initializeApp(getFirebaseConfig());
export const auth = getAuth(app);

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

export const registerUserWithEmailAndPassword = async (
  displayName: string, 
  email: string,
  password: string
): Promise<User | null> => {
  if (!email || !password) {
    throw new Error('Both email and password are required.');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    if (userCredential.user) {
      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: displayName,
      });

      return userCredential.user;
    }

    return null;
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
