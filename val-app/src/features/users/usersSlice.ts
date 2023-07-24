import { createSlice } from '@reduxjs/toolkit'

const initialState = [
  { id: '0', name: 'Actually Toxic ' },
  { id: '1', name: 'TooPro Noob' },
  { id: '2', name: 'CrispyAppleSlice' }
]

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {}
})

export default usersSlice.reducer