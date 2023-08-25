import { createAsyncThunk, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { RootState, store } from '../../app/store';

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

const usersSliceWithAsync = createSlice({
  name: 'users',
  initialState: initialState,
  reducers: {
  setLoggedInUser: (state, action: PayloadAction<User | null>) => {
    state.loggedInUser = action.payload;
   },
  },
});

export const selectLoggedInUser = (state: RootState) => state.users.loggedInUser;
export const { setLoggedInUser } = usersSliceWithAsync.actions;

export default usersSliceWithAsync.reducer;