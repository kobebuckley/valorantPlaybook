import { createSlice, PayloadAction, nanoid, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { FetchResult, client } from '../../api/client';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '../../firebase/firebase-config';

export interface Post {
  displayName: string;
  moderated: boolean;
  id: string;
  date: string;
  title: string;
  content: string;
  videoUrl: string;
  agent: string;
  userId: string;
  reactions: { [key: string]: number };
  status: 'pending' | 'approved' | 'rejected' | 'idle' | 'added' | 'succeeded' | 'failed'
  
}

interface PostsState {
  posts: Post[];
  status: string;
  adding: string; // 'idle', 'loading', 'adding', 'succeeded', 'failed'
  error: string | null | undefined;
  editingPostId: string | null;
}

const initialState: PostsState = {
  posts: [],
  status: 'idle',
  adding: 'idle',
  error: null,
  editingPostId: null,
};

export const selectAddingStatus = (state: RootState) => state.posts.adding;
export const selectEditingPostId = (state: RootState) => state.posts.editingPostId;


//! Agent selector version if needed
// export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (agent: string) => {
//   try {
//     const response: FetchResult = await client.get(`http://localhost:3000/api/posts?agent=${agent}`);
//     console.log('API Response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching posts:', error);
//     throw error; 
//   }
// });

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'posts'));
    const posts: Post[] = querySnapshot.docs.map((doc) => doc.data() as Post);
    console.log('Fetched Posts:', posts); // Log fetched posts
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existingPost = state.posts.find(post => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },   
  
    postAdded: {
      reducer(state, action: PayloadAction<Post>) {
        state.posts.push(action.payload);
        state.adding = 'succeeded';
      },
      prepare(title: string, content: string, videoUrl: string, agent: string, userId: string, displayName: string): { payload: Post } {
        return {
          payload: {
            id: nanoid(),
            displayName,
            date: new Date().toISOString(),
            title,
            content,
            videoUrl,
            agent,
            userId,
            reactions: {},
            status: 'pending', 
            moderated: false
          },
        };
      },
      
    },
    postUpdated(state, action: PayloadAction<Post>) {
      const { id, displayName, date, title, content, videoUrl, agent } = action.payload;
      const existingPost = state.posts.find((post) => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.date = date;
        existingPost.content = content;
        existingPost.videoUrl = videoUrl;
        existingPost.agent = agent;
      }
    },
    postApproved(state, action: PayloadAction<string>) {
      const postId = action.payload;
      const existingPost = state.posts.find(post => post.id === postId);
      if (existingPost) {
        existingPost.status = 'approved';
      }
    },

    postRejected(state, action: PayloadAction<string>) {
      const postId = action.payload;
      const existingPost = state.posts.find(post => post.id === postId);
      if (existingPost) {
        existingPost.status = 'rejected';
      }
    },
    
    startAddingPost: (state, action: PayloadAction<string>) => {
      state.adding = 'adding';
      state.editingPostId = action.payload;
    },
    finishAddingPost: (state) => {
      state.adding = 'succeeded';
      state.editingPostId = null;
    },
    cancelAddingPost: (state) => {
      state.adding = 'idle';
      state.editingPostId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(postAdded, (state) => {
        state.adding = 'idle';
      });
  },
});

export const {
  postAdded,
  postUpdated,
  reactionAdded,
  postRejected,
  startAddingPost,
  finishAddingPost,
  cancelAddingPost,
  postApproved, 

} = postsSlice.actions;


export const selectAllPosts = (state: RootState) => state.posts.posts;

export const selectPostById = (state: RootState, postId: string) =>
  state.posts.posts.find((post: Post) => post.id === postId);

export const selectPendingPosts = (state: RootState) =>
  state.posts.posts.filter((post: Post) => post.status === 'pending');


export default postsSlice.reducer;
