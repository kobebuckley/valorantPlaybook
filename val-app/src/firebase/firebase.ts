import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  NextOrObserver,
  User
} from 'firebase/auth';

let app: any; // Type 'any' for demonstration purposes
let auth: any; // Type 'any' for demonstration purposes


// Fetch the configuration from the server
const firebaseConfigPromise = fetch('/api/config')
  .then(response => response.json())
  .then(config => {
    app = initializeApp(config);
    auth = getAuth(app);
  })
  .catch(error => {
    console.error('Error fetching configuration:', error);
  });

// Export your functions outside of the .then block
export const signInUser = async (
  email: string, 
  password: string
) => {
  await firebaseConfigPromise; // Wait for Firebase initialization
  if (!email && !password) return;

  return await signInWithEmailAndPassword(auth, email, password)
}

export const SignOutUser = async () => {
  await firebaseConfigPromise; // Wait for Firebase initialization
  return await signOut(auth);
}

export const userStateListener = (callback: NextOrObserver<User>) => {
  return onAuthStateChanged(auth, callback);
}
