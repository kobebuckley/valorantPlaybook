// AUth in progress


import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { sub } from 'date-fns';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const posts = [
{
  id: '1',
  date: sub(new Date(), { minutes: 10 }).toISOString(),
  title: 'Liquid Nats!',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu dapibus libero. Nulla dapibus, pursdfsqafdfsdfsfd',
  videoUrl: 'https://www.youtube.com/watch?v=0t-A41qBGmg&pp=ygUKZ2Vra28gcHJvIA%3D%3D',
  agent: 'breach',
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
  agent: 'fade',
  userId: '1',
  reactions: {thumbsUp: 5, hooray: 23, heart: 4, rocket: 23, eyes: 59}

},
{
  id: '4',
  date: sub(new Date(), { minutes: 2 }).toISOString(),
  title: 'Liquid Nats Again!',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu dapibus libero. Nulla dapibus, pursdfsqafdfsdfsfd',
  videoUrl: 'https://www.youtube.com/watch?v=aVgkN9dMXCY&pp=ygUKZ2Vra28gcHJvIA%3D%3D',
  agent: 'fade',
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


app.get('/api/posts', (req, res) => {
    const { agent } = req.query;
  
    if (agent) {
      // Filter posts by agent if 'agent' query parameter is provided
      const filteredPosts = posts.filter((post) => post.agent === agent);
      res.json(filteredPosts);
    } else {
      // If 'agent' query parameter is not provided, return all posts
      res.json(posts);
    }
  });
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });