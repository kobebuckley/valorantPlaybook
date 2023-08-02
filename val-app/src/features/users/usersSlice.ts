import { createSlice } from '@reduxjs/toolkit';
import bcrypt from 'bcryptjs';

// Function to generate a hashed password
async function generateHashedPassword(plainPassword: string) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}

// Define the initial state with hashed passwords
const initialState = [
  { id: '0', name: 'Actually Toxic', username: 'at', password: await generateHashedPassword('toxic') },
  { id: '1', name: 'TooPro Noob', username: 'tpn', password: await generateHashedPassword('noob') },
  { id: '2', name: 'CrispyAppleSlice', username: 'cas', password: await generateHashedPassword('slice') }
];

// Function to authenticate a user
export async function authenticateUser(username: string, password: string) {
  const user = initialState.find((user) => user.username === username);

  if (!user) {
    console.log(`User ${username} not found`);
    return null;
  }

  try {
    if (await bcrypt.compare(password, user.password)) {
      console.log(`Authentication successful for ${username}`);
      return user;
    } else {
      console.log(`Authentication failed for ${username} using ${password}`);
      return null;
    }
  } catch (error) {
    console.error('Error during password comparison:', error);
    return null;
  }
}

// Testing the authentication function
// async function testAuthentication() {
//   const username = 'tpn'; // Use the correct username from your initial state
//   const password = 'noob'; // Use the actual password for the user 'at'

//   const user = await authenticateUser(username, password);

//   if (user) {
//     console.log('Authentication successful:', user);
//   } else {
//     console.log('Authentication failed');
//   }
// }

// testAuthentication();

// Create a users slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action) => {
      // Update the state with the user data received from action.payload
      // This assumes your initialState is an array
      const { id, name, username, password } = action.payload;
      const userIndex = state.findIndex(user => user.id === id);
      if (userIndex !== -1) {
        state[userIndex] = { id, name, username, password };
      }
    }
  }
});

export const { setUser } = usersSlice.actions; // Export the setUser action

export default usersSlice.reducer;