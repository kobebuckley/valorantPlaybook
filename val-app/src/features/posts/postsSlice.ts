import { PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit';

interface Post {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
  agent: string;
}

const initialState: Post[] = [
  {
    id: '1',
    title: 'First Post!',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu dapibus libero. Nulla dapibus, pursdfsqafdfsdfsfd',
    videoUrl: 'https://www.youtube.com/watch?v=ohu59Ssdq7g',
    agent: 'gekko'
  },
  {
    id: '2',
    title: 'Second Post',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu dapibus libero. Nulla dapibus, pursdfsqafdfsdfsfd',
    videoUrl: 'https://www.youtube.com/watch?v=7lVE9BQENGg',
    agent: 'gekko'
  },
  {
    id: '3',
    title: 'Third Post!',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu dapibus libero. Nulla dapibus, pursdfsqafdfsdfsfd',
    videoUrl: 'https://www.youtube.com/watch?v=ohu59Ssdq7g',
    agent: 'gekko'
  },
  {
    id: '4',
    title: 'Fourth Post',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu dapibus libero. Nulla dapibus, pursdfsqafdfsdfsfd',
    videoUrl: 'https://www.youtube.com/watch?v=7lVE9BQENGg',
    agent: 'gekko'
  },
  {
    id: '5',
    title: 'First Post!',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu dapibus libero. Nulla dapibus, pursdfsqafdfsdfsfd',
    videoUrl: 'https://www.youtube.com/watch?v=ohu59Ssdq7g',
    agent: 'fade'
  },
  {
    id: '6',
    title: 'Second Post',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu dapibus libero. Nulla dapibus, pursdfsqafdfsdfsfd',
    videoUrl: 'https://www.youtube.com/watch?v=7lVE9BQENGg',
    agent: 'fade'
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
      prepare(title: string, content: string, videoUrl: string, agent: string): { payload: Post } {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            videoUrl,
            agent
          },
        };
      },
    },
    postUpdated(state, action: PayloadAction<Post>) {
      const { id, title, content, videoUrl, agent } = action.payload;
      const existingPost = state.find((post) => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
        existingPost.videoUrl = videoUrl;
        existingPost.agent = agent;
      }
    },
  },
});

export const { postAdded, postUpdated } = postsSlice.actions;

export default postsSlice.reducer;
