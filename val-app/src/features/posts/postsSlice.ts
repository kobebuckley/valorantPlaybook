import { PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit';
import { sub } from 'date-fns'
import { RootState } from '../../app/store';


interface Post {
  id: string;
  date: string;
  title: string;
  content: string;
  videoUrl: string;
  agent: string;
  userId: string;
  reactions: { [key: string]: number };
}

const initialState: Post[] = [
  {
    id: '1',
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    title: 'Liquid Nats!',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu dapibus libero. Nulla dapibus, pursdfsqafdfsdfsfd',
    videoUrl: 'https://www.youtube.com/watch?v=0t-A41qBGmg&pp=ygUKZ2Vra28gcHJvIA%3D%3D',
    agent: 'gekko',
    userId: '0',
    reactions: {thumbsUp: 23, hooray: 2, heart: 254, rocket: 3, eyes: 5}

  },
  {
    id: '2',
    date: sub(new Date(), { minutes: 20 }).toISOString(),
    title: 'Second Post',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu dapibus libero. Nulla dapibus, pursdfsqafdfsdfsfd',
    videoUrl: 'https://www.youtube.com/watch?v=7lVE9BQENGg',
    agent: 'gekko',
    userId: '0',
    reactions: {thumbsUp: 324, hooray: 2, heart: 200, rocket: 2, eyes: 5}

  },
  {
    id: '3',
    date:'',
    title: 'Third Post!',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu dapibus libero. Nulla dapibus, pursdfsqafdfsdfsfd',
    videoUrl: 'https://www.youtube.com/watch?v=ohu59Ssdq7g',
    agent: 'gekko',
    userId: '1',
    reactions: {thumbsUp: 5, hooray: 23, heart: 4, rocket: 23, eyes: 59}

  },
  {
    id: '4',
    date: sub(new Date(), { minutes: 2 }).toISOString(),
    title: 'Liquid Nats Again!',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu dapibus libero. Nulla dapibus, pursdfsqafdfsdfsfd',
    videoUrl: 'https://www.youtube.com/watch?v=aVgkN9dMXCY&pp=ygUKZ2Vra28gcHJvIA%3D%3D',
    agent: 'gekko',
    userId: '2',
    reactions: {thumbsUp: 30, hooray: 345, heart: 4, rocket: 342, eyes: 23}

  },
  {
    id: '5',
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    title: 'Sen Sick!',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu dapibus libero. Nulla dapibus, pursdfsqafdfsdfsfd',
    videoUrl: 'https://www.youtube.com/watch?v=i7OsvSE4MEU&pp=ygUJZmFkZSBwcm8g',
    agent: 'fade',
    userId: '2',
    reactions: {thumbsUp: 90, hooray: 45, heart: 2, rocket: 3, eyes: 34}

  },
  {
    id: '6',
    date: sub(new Date(), { minutes: 45 }).toISOString(),
    title: '100T Asuna',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu dapibus libero. Nulla dapibus, pursdfsqafdfsdfsfd',
    videoUrl: 'https://www.youtube.com/watch?v=AptQ7AXVXmw&pp=ygUSZmFkZSB2YWxvcmFudCBwcm8g',
    agent: 'fade',
    userId: '2',
    reactions: {thumbsUp: 49583, hooray: 12313, heart: 3434, rocket: 333432, eyes: 300}

  }
];

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.find(post => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    postAdded: {
      reducer(state, action: PayloadAction<Post>) {
        state.push(action.payload);
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
      const existingPost = state.find((post) => post.id === id);
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

export const selectAllPosts = (state: RootState) => state.posts;

export const selectPostById = (state: RootState, postId: string) =>
  state.posts.find((post: Post) => post.id === postId);