

import React, { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

function App() {
  useEffect(() => {
    fetch('/api/config')
      .then(response => response.json())
      .then(config => {
        const app = initializeApp(config);
        const auth = getAuth(app);
        // Now you can use Firebase services like authentication, Firestore, etc.
      })
      .catch(error => {
        console.error('Error fetching configuration:', error);
      });
  }, []);

}export default App