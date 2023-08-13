import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore module

console.log('API Key:', import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY);
console.log('Auth Domain:', import.meta.env.VITE_REACT_APP_FIREBASE_AUTH_DOMAIN);



const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_REACT_APP_FIREBASE_APP_ID,
};
console.log('Environment variables:', import.meta.env);

const app = initializeApp(firebaseConfig); // Initialize the Firebase app
export const auth = getAuth(); // Get the Firebase Auth instance
// const firestore = getFirestore(); 

export function getFirebaseConfig() {
  console.log('Config:', firebaseConfig); // Log the config object

  if (!firebaseConfig || !firebaseConfig.apiKey) {
    throw new Error(
      'No Firebase configuration object provided.' +
        '\n' +
        "Add your web app's configuration object to firebase-config.ts"
    );
  } else {
    return firebaseConfig;
  }
}


export const db = getFirestore(app)

// export { app, auth, }; // Export the Firestore instance
