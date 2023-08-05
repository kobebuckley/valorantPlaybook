import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
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
  users: [],
  loggedInUser: null,
};

const initialStatePromise = async () => {
  const hashedPasswordAdmin = await generateHashedPassword("adminBased");
  const hashedPasswordToxic = await generateHashedPassword("toxic");
  const hashedPasswordNoob = await generateHashedPassword("noob");
  const hashedPasswordSlice = await generateHashedPassword("slice");

  return {
    users: [
      { id: "0", name: "Admin", username: "admin", hashedPassword: hashedPasswordAdmin, isAdmin: true },
      { id: '1', name: 'Actually Toxic', username: 'at', hashedPassword: hashedPasswordToxic, isAdmin: false },
      { id: '2', name: 'TooPro Noob', username: 'tpn', hashedPassword: hashedPasswordNoob, isAdmin: false },
      { id: '3', name: 'CrispyAppleSlice', username: 'cas', hashedPassword: hashedPasswordSlice, isAdmin: false }
    ],
    loggedInUser: null,
  };
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUserInitialState: (state, action: PayloadAction<UsersState>) => {
      return action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    setLoggedInUser: (state, action: PayloadAction<User | null>) => {
      state.loggedInUser = action.payload;
    },
  },
});

export const addUserAsync = (user: User) => {
  return async (dispatch: Dispatch) => {
    const hashedPassword = await generateHashedPassword(user.hashedPassword);
    const newUser = { ...user, hashedPassword };
    
    dispatch(addUser(newUser));
  };
};

export const authenticateUser = async (username: string, password: string) => {
  const users = store.getState().users.users;
  const user = users.find((user: User) => user.username === username);
  
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
