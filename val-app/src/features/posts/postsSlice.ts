import { createSlice, PayloadAction, nanoid, createAsyncThunk, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { FetchResult, client } from '../../api/client';



export interface Post {
  id: string;
  date: string;
  title: string;
  content: string;
  videoUrl: string;
  agent: string;
  userId: string;
  reactions: { [key: string]: number };
}

interface PostsState {
  posts: Post[];
  status: string;
  error: string | null | undefined;
}

const initialState: PostsState = {
  posts: [],
  status: 'idle',
  error: null,
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (agent: string) => {
  try {
    // Use the new client function to make the API request to your Express server
    const response: FetchResult = await client.get(`http://localhost:3000/api/posts?agent=${agent}`);
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error; // Rethrow the error to be caught in the rejected case
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
      },
      prepare(title: string, content: string, videoUrl: string, agent: string, userId: string): { payload: Post } {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            title,
            content,
            videoUrl,
            agent,
            userId,
            reactions: {}
          },
        };
      },
    },
    postUpdated(state, action: PayloadAction<Post>) {
      const { id, date, title, content, videoUrl, agent } = action.payload;
      const existingPost = state.posts.find((post) => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.date = date;
        existingPost.content = content;
        existingPost.videoUrl = videoUrl;
        existingPost.agent = agent;
      }
    },
    postRejected(state, action: PayloadAction<{ error: { message: string } }>) {
      state.status = 'failed';
      state.error = action.payload.error.message;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = state.posts.concat(action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { postAdded, postUpdated, reactionAdded, postRejected } = postsSlice.actions;


export const selectAllPosts = (state: RootState) => state.posts.posts;

export const selectPostById = (state: RootState, postId: string) =>
state.posts.posts.find((post: Post) => post.id === postId);

export default postsSlice.reducer;