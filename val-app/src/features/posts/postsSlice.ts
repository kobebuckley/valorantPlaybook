import { PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit';
import { sub } from 'date-fns'
import { RootState } from '../../app/store';

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
  error: null | string;
}

const initialState: PostsState = {
  posts: [],
  status: 'idle',
  error: null,
};

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
  },
});

export const { postAdded, postUpdated, reactionAdded  } = postsSlice.actions;

export default postsSlice.reducer;

export const selectAllPosts = (state: RootState) => state.posts.posts;

export const selectPostById = (state: RootState, postId: string) =>
  state.posts.posts.find((post: Post) => post.id === postId);
