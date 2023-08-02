// LoginPage.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { authenticateUser } from './users/usersSlice';
import { setUser } from './users/usersSlice';

function LoginPage() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e: React.FormEvent) => { // Add the type annotation for e
    e.preventDefault();

    // Call the authenticateUser function
    const user = await authenticateUser(username, password);

    if (user) {
      // Dispatch the setUser action to update the user state in Redux store
      dispatch(setUser(user)); // Dispatch the setUser action
      setLoginError('');
    } else {
      setLoginError('Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {loginError && <p>{loginError}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
