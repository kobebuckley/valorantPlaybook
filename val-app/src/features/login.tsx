import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { authenticateUser } from './users/usersSlice';
import { setUser } from './users/usersSlice';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  onLogin: () => void;
}

function LoginPage({ onLogin }: LoginPageProps) {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = await authenticateUser(username, password);

    if (user) {
      dispatch(setUser(user));
      setLoginError('');
      setSuccessMessage('Success! Logging in should do stuff...'); 
      onLogin();
    } else {
      setLoginError('Authentication failed. Please check your credentials.');
      setSuccessMessage(''); 
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        {loginError && <p className="text-red-500 mb-2">{loginError}</p>}
        {successMessage && <p className="text-blue-500 mb-2">{successMessage}</p>}
        <form onSubmit={handleLogin}>
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
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
