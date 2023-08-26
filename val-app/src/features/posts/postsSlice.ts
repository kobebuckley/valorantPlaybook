import { createSlice, PayloadAction, nanoid, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
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
}


interface PostsState {
  posts: Post[];
  status: string;
  adding: string; 
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
export const selectEditingPostId = (state: RootState) => state.posts.editingPostId


export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'posts'));

    const posts: Post[] = querySnapshot.docs.map((doc) => doc.data() as Post);
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
      const { id, reaction } = action.payload;
      const existingPost = state.posts.find(post => post.id == id);
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
            moderated: false
          },
        };
      },
      
    },
    postUpdated(state, action: PayloadAction<Post>) {
      const { id, date, title, content, videoUrl, agent } = action.payload;

      const existingPost = state.posts.find((post) => post.id == id);
      if (existingPost) {
        existingPost.id = id;

        existingPost.title = title;
        existingPost.date = date;
        existingPost.content = content;
        existingPost.videoUrl = videoUrl;
        existingPost.agent = agent;
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
} = postsSlice.actions;


export const selectAllPosts = (state: RootState) => state.posts.posts;

export const selectPostById = (state: RootState, id: string) =>
  state.posts.posts.find((post: Post) => post.id == id);


export default postsSlice.reducer;
