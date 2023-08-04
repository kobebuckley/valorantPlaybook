import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import bcrypt from 'bcryptjs';
import { RootState, store } from '../../app/store';
import { generateHashedPassword } from './passwordUtils';

export interface User {
  id: string;
  name: string;
  username: string;
  hashedPassword: string;
  isAdmin: boolean;
}

interface UsersState {
  users: User[];
  loggedInUser: User | null;
}

const initialState: UsersState = {
  users: [
    { id: '0', name: 'Admin', username: 'admin', hashedPassword: await generateHashedPassword('adminBased'), isAdmin: true },
    { id: '1', name: 'Actually Toxic', username: 'at', hashedPassword: await generateHashedPassword('toxic'), isAdmin: false },
    { id: '2', name: 'TooPro Noob', username: 'tpn', hashedPassword: await generateHashedPassword('noob'), isAdmin: false },
    { id: '3', name: 'CrispyAppleSlice', username: 'cas', hashedPassword: await generateHashedPassword('slice'), isAdmin: false }
  ],
  loggedInUser: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    setLoggedInUser: (state, action: PayloadAction<User | null>) => {
      state.loggedInUser = action.payload;
    },
  },
});


export const authenticateUser = async (username: string, password: string) => {
  const user = store.getState().users.users.find(
    (user: User) => user.username === username
    );
    
    
    if (!user) {
      console.log(`User ${username} not found`);
      return null;
    }
    
    try {
      if (await bcrypt.compare(password, user.hashedPassword)) {
        console.log(`Authentication successful for ${username}`);
        return user;
      } else {
        console.log(`Authentication failed for ${username}`);
        return null;
      }
    } catch (error) {
      console.error('Error during password comparison:', error);
      return null;
    }
  };
  
  export const selectLoggedInUser = (state: RootState) => state.users.loggedInUser;

  // Export other actions and reducer as before
  export const { addUser, setLoggedInUser } = usersSlice.actions;
  export default usersSlice.reducer;
