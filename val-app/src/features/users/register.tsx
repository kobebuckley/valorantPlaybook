import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { User, setLoggedInUser, addUserAsync } from './usersSlice';
import { Dispatch } from '@reduxjs/toolkit';

interface RegisterPageProps {
  onRegister: () => void;
}

function RegisterPage({ onRegister }: RegisterPageProps) {
  const dispatch = useDispatch<Dispatch<any>>(); // Type Dispatch<any> to allow any action

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: displayName, username, password }), 
      });
  
      console.log('response: ', response);
  
      if (response.ok) {
        const registeredUser = await response.json();
        console.log('before dispatch: ', registeredUser);

        dispatch(addUserAsync({ ...registeredUser, hashedPassword: password, name: displayName }));
        setRegistrationSuccess(true);
        setRegistrationError('');
        onRegister();
        console.log('does it work?: ', registeredUser);

        // Clear input fields after successful registration
        setDisplayName('');
        setUsername('');
        setPassword('');
      } else {
        const errorData = await response.json();
        setRegistrationError(errorData.message);
        setRegistrationSuccess(false);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setRegistrationError('Registration failed. Please try again later.');
      setRegistrationSuccess(false);
    }
  };
  
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
        {registrationSuccess ? (
          <p className="text-green-500 mb-2">Registration successful! You can now log in.</p>
        ) : (
          <div>
            {registrationError && <p className="text-red-500 mb-2">{registrationError}</p>}
            <div className="mb-4">
              <label htmlFor="displayName" className="block font-medium">
                Display Name:
              </label>
              <input
                type="text"
                id="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="username" className="block font-medium">
                Username:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block font-medium">
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleRegister}
              className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
