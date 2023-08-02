import { createSlice } from '@reduxjs/toolkit';
import bcrypt from 'bcrypt';

const initialState = [
  { id: '0', name: 'Actually Toxic', role: 'admin', username: 'atc', password: '' },
  { id: '1', name: 'TooPro Noob', role: 'user', username: 'tpn', password: '' },
  { id: '2', name: 'CrispyAppleSlice', role: 'user', username: 'cas', password: '' }
];

// Function to authenticate a user
async function authenticateUser(username: string, password: string | Buffer) {
  const user = initialState.find(user => user.username === username);

  if (user && await bcrypt.compare(password, user.password)) {
    return user;
  } else {
    return null;
  }
}

// Testing the authentication function
async function testAuthentication() {
  const username = 'atc'; // Use the correct username from your initial state
  const password = 'your_password_here'; // Use the intended password for the user

  const user = await authenticateUser(username, password);

  if (user) {
    console.log('Authentication successful:', user);
  } else {
    console.log('Authentication failed');
  }
}

testAuthentication();
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {}
})

export default usersSlice.reducer