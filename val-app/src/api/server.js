import express from 'express';

import mongoose from 'mongoose';
import dotenv from 'dotenv'

import cors from 'cors';
import bodyParser from 'body-parser';
import { sub } from 'date-fns';
import path from 'path';
import bcrypt from 'bcrypt';

const app = express();
const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION


app.use(cors());
app.use(bodyParser.json());
mongoose.set('strictQuery',false)

if (process.env.NODE_ENV !== 'production'){
  dotenv.config()
}




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
function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}
const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
const registeredUsers = [];

app.post('/api/register', async (req, res) => {
  const { name, username, password } = req.body;

  if (registeredUsers.some(user => user.username === username)) {
    return res.status(400).json({ message: 'Username already taken' });
  }

  const hashedPassword = await hashPassword(password); 

  const newUser = {
    id: generateUniqueId(),
    name,
    username,
    hashedPassword, 
    isAdmin: false,
  };
  registeredUsers.push(newUser);

  res.status(201).json({ user: newUser });
});

app.get('/api/posts', (req, res) => {
  const { agent } = req.query;

  if (agent) {
    const filteredPosts = posts.filter(post => post.agent === agent);
    res.json(filteredPosts);
  } else {
    res.json(posts);
  }
});


const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(express.static(path.join(__dirname, '../../build')));

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});



const start = async() => {
  try {

    await mongoose.connect(CONNECTION)
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (e){
    console.log(e.message)
  }
}

start()