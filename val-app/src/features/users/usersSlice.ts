import { createAsyncThunk, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import bcrypt from 'bcryptjs';
import { RootState, store } from '../../app/store';
// import { generateHashedPassword } from './passwordUtils';

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


export const fetchInitialState = createAsyncThunk('users/fetchInitialState', async () => {
  try {
    const response = await fetch('http://localhost:3000/api/users');
    console.log(`The main response ${response}`)
    if (response.ok) {
      const users = await response.json();
      console.log(`The main users ${users}`)

      return users; 
    } else {
      console.error('Failed to fetch users from the server.');
      throw new Error('Failed to fetch users from the server.');
    }
  } catch (error) {
    console.error('Error while fetching users:', error);
    throw error;
  }
});





const usersSliceWithAsync = createSlice({
  name: 'users',
  initialState: initialState,
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
extraReducers: (builder) => {
  builder.addCase(fetchInitialState.fulfilled, (state, action) => {
    state.users = action.payload;
  });
},
});

export const addUserAsync = (user: User) => {
  return async (dispatch: Dispatch) => {
    dispatch(usersSliceWithAsync.actions.addUser(user)); // Use the action from the new slice
  };
};

export const authenticateUser = async (username: string, password: string) => {
  try {
    
    const response = await fetch(`http://localhost:3000/api/users?username=${username}`);
    if (response.ok) {
      const users = await response.json();

      // Find the user with the specified username
      const user = users.find((u: User) => u.username === username);

      if (user && user.hashedPassword) {
        if (await bcrypt.compare(password, user.hashedPassword)) {
          console.log(`Authentication successful for ${username}`);
          return user;
        } else {
          console.log(`Authentication failed for ${username}`);
          return null;
        }
      } else {
        console.log(`User ${username} not found or missing hashedPassword`);
        return null;
      }
    } else {
      console.log(`User ${username} not found`);
      return null;
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    return null;
  }
};



  export const selectLoggedInUser = (state: RootState) => state.users.loggedInUser;

  // export const { addUser, setLoggedInUser } = usersSlice.actions;
  // export default usersSlice.reducer;

  export const { addUser, setLoggedInUser } = usersSliceWithAsync.actions;
export default usersSliceWithAsync.reducer;