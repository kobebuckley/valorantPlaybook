import { PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit';

interface Post {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
}

const initialState: Post[] = [
  {
    id: '1',
    title: 'First Post!',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu dapibus libero. Nulla dapibus, pursdfsqafdfsdfsfd',
    videoUrl: 'https://www.youtube.com/watch?v=ohu59Ssdq7g'
  },
  {
    id: '2',
    title: 'Second Post',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu dapibus libero. Nulla dapibus, pursdfsqafdfsdfsfd',
    videoUrl: 'https://www.youtube.com/watch?v=7lVE9BQENGg'
  }
];

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action: PayloadAction<Post>) {
        state.push(action.payload);
      },
      prepare(title: string, content: string, videoUrl: string): { payload: Post } {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            videoUrl
          },
        };
      },
    },
    postUpdated(state, action: PayloadAction<Post>) {
      const { id, title, content, videoUrl } = action.payload;
      const existingPost = state.find((post) => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
        existingPost.videoUrl = videoUrl;
      }
    },
  },
});

export const { postAdded,postUpdated} = postsSlice.actions;

export default postsSlice.reducer;
