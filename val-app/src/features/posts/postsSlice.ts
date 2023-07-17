import { createSlice } from '@reduxjs/toolkit'


//! NEEDS a secure api integration -> Posts will have a video url that serves as the thumbnail / image pulling from that data. Also will organize into folders. 

// Other needed data such as upload date to determine which videos show at the top first. 

// Every post will be sent to the server for approval by Admin before uploading.

//? implement a Search component above this to search for posts from specific youtube channels? 


const initialState = [
  { 
    id: '1', 
    title: 'First Post!', 
    content: 'Hello!', 
    videoUrl: 'https://www.youtube.com/watch?v=ohu59Ssdq7g' 
  },
  { 
    id: '2', 
    title: 'Second Post', 
    content: 'More text', 
    videoUrl: 'https://www.youtube.com/watch?v=7lVE9BQENGg' 
  }
];

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {}
});

export default postsSlice.reducer;