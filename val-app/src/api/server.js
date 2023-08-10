import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import express from 'express';

import mongoose from 'mongoose';
import dotenv from 'dotenv'

import cors from 'cors';
import bodyParser from 'body-parser';
import { sub } from 'date-fns';
import path from 'path';
import bcrypt from 'bcrypt';


import session from 'express-session'; 
import { userSchema } from './models/users.js'; 
import { postSchema, Post } from './models/posts.js'; 
import jwt from 'jsonwebtoken'; 

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';


function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

// import cors from 'cors';

const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true, 
};




const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();



mongoose.set('strictQuery', false);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PORT = process.env.PORT;
const CONNECTION = process.env.CONNECTION;

const User = mongoose.model('User', userSchema);


const posts = [
{
  id: '1',
  date: new Date().toISOString(),
  title: 'Liquid Nats!',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu dapibus libero. Nulla dapibus, pursdfsqafdfsdfsfd',
  videoUrl: 'https://www.youtube.com/watch?v=0t-A41qBGmg&pp=ygUKZ2Vra28gcHJvIA%3D%3D',
  agent: 'breach',
  userId: '0',
  reactions: {thumbsUp: 23, hooray: 2, heart: 254, rocket: 3, eyes: 5},
  moderated: true


},
{
  id: '2',
  date: sub(new Date(), { minutes: 20 }).toISOString(),
  title: 'Second Post',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu dapibus libero. Nulla dapibus, pursdfsqafdfsdfsfd',
  videoUrl: 'https://www.youtube.com/watch?v=7lVE9BQENGg',
  agent: 'gekko',
  userId: '0',
  reactions: {thumbsUp: 324, hooray: 2, heart: 200, rocket: 2, eyes: 5},
  moderated: true


},
{
  id: '3',
  date: sub(new Date(), { minutes: 21 }).toISOString(),
  title: 'Third Post!',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu dapibus libero. Nulla dapibus, pursdfsqafdfsdfsfd',
  videoUrl: 'https://www.youtube.com/watch?v=ohu59Ssdq7g',
  agent: 'fade',
  userId: '1',
  reactions: {thumbsUp: 5, hooray: 23, heart: 4, rocket: 23, eyes: 59},
  moderated: false


},
{
  id: '4',
  date: sub(new Date(), { minutes: 2 }).toISOString(),
  title: 'Liquid Nats Again!',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu dapibus libero. Nulla dapibus, pursdfsqafdfsdfsfd',
  videoUrl: 'https://www.youtube.com/watch?v=aVgkN9dMXCY&pp=ygUKZ2Vra28gcHJvIA%3D%3D',
  agent: 'fade',
  userId: '2',
  reactions: {thumbsUp: 30, hooray: 345, heart: 4, rocket: 342, eyes: 23},
  moderated: false


},
{
  id: '5',
  date: sub(new Date(), { minutes: 5 }).toISOString(),
  title: 'Sen Sick!',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu dapibus libero. Nulla dapibus, pursdfsqafdfsdfsfd',
  videoUrl: 'https://www.youtube.com/watch?v=i7OsvSE4MEU&pp=ygUJZmFkZSBwcm8g',
  agent: 'fade',
  userId: '2',
  reactions: {thumbsUp: 90, hooray: 45, heart: 2, rocket: 3, eyes: 34},
  moderated: true


},
{
  id: '6',
  date: sub(new Date(), { minutes: 45 }).toISOString(),
  title: '100T Asuna',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu dapibus libero. Nulla dapibus, pursdfsqafdfsdfsfd',
  videoUrl: 'https://www.youtube.com/watch?v=AptQ7AXVXmw&pp=ygUSZmFkZSB2YWxvcmFudCBwcm8g',
  agent: 'fade',
  userId: '2',
  reactions: {thumbsUp: 49583, hooray: 12313, heart: 3434, rocket: 333432, eyes: 300},
  moderated: false

  
}
];

// Set up session middleware
app.use(session({
  secret: 'SECRET_KEY',
  resave: false,
  saveUninitialized: false
}));


// Set up passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set up passport LocalStrategy for login
passport.use(new LocalStrategy((username, password, done) => {
  // Authenticate user here and call done(err) or done(null, user);
  // Example: Compare the hashed passwords
  User.findOne({ username }, async (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false);
    
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) return done(null, false);
    
    return done(null, user);
  });
}));


// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  // Fetch user from DB based on id and call done(null, user);
});

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY // Use your actual secret key
}, (jwtPayload, done) => {
  User.findById(jwtPayload.sub, (err, user) => {
    if (err) return done(err, false);
    if (user) return done(null, user);
    return done(null, false);
  });
}));


const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;

};

// Middleware for route protection
const isAuthenticated = passport.authenticate('jwt', { session: false });

// Custom middleware for authorization
const checkAdmin = (req, res, next) => {
  const user = req.user;
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  next();
};

// Example route protected with JWT authentication and authorization
app.get('/api/posts/non-moderated', isAuthenticated, checkAdmin, async (req, res) => {
  try {
    const nonModeratedPosts = await Post.find({ moderated: false });
    res.status(200).json(nonModeratedPosts);
  } catch (error) {
    res.status(500).json({ message: 'Error while fetching non-moderated posts' });
  }
});

//! Example route protected only with JWT authentication
// app.get('/api/protected-route', isAuthenticated, (req, res) => {
//   res.status(200).json({ message: 'This is a protected route' });
// });




//! non admin checked versus that does work
// app.get('/api/posts/non-moderated', async (req, res) => {
  
//   try {
//     const nonModeratedPosts = await Post.find({ moderated: false });
//     res.status(200).json(nonModeratedPosts);
//   } catch (error) {
//     res.status(500).json({ message: 'Error while fetching non-moderated posts' });
//   }
// });
//   { withCredentials: true }


// app.get('/api/posts/non-moderated', async (req, res) => {
//   try {
//     const nonModeratedPosts = await Post.find({ moderated: false });
//     res.status(200).json(nonModeratedPosts);
//   } catch (error) {
//     res.status(500).json({ message: 'Error while fetching non-moderated posts' });
//   }
// });

// export default router;



app.put('/api/posts/:postId/status', async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { postId } = req.params;
  const { moderated } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(postId, { moderated }, { new: true });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating post status:', error);
    res.status(500).json({ message: 'Error updating post status' });
  }
});


// post a new registered user and save

app.post('/api/users2', async (req, res) => {
  const { name, username, password } = req.body;

  if (await User.findOne({ username })) {
    // return res.status(400).json({ message: 'Username already taken' });
    return res.status(400).json({ message: 'Incorrect Username or Password' });
  }
// sb
  const hashedPassword = await hashPassword(password);

  const newUser = new User({
    id: generateUniqueId(),
    name,
    username,
    hashedPassword,
    isAdmin: false,
  });

  try {
    const savedUser = await newUser.save();
    console.log('User saved:', savedUser);
    res.status(201).json({ user: savedUser });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'Error while saving user' });
  }
});



app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error while fetching users' });
  }
});



app.get('/api/posts', async (req, res) => {
  try {
    const thePosts = await Post.find({});
    res.status(200).json(thePosts);
  } catch (error) {
    res.status(500).json({ message: 'Error while fetching users' });
  }
});


//area to login? or customize the find all users? 


app.post('/api/login', passport.authenticate('local', { session: false }), (req, res) => {
  const user = req.user; // The user object is available after authentication
  const token = jwt.sign({ sub: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });

  res.status(200).json({ token, user });
});


const start = async () => {

  const generateHashedPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  };

  
  try {
    await mongoose.connect(CONNECTION);
    console.log('Connected to MongoDB');

    // Generate hashed passwords for hard-coded users
    const hashedAdminPassword = await generateHashedPassword('adminBased');
    const hashedToxicPassword = await generateHashedPassword('toxic');
    const hashedNoobPassword = await generateHashedPassword('noob');
    const hashedSlicePassword = await generateHashedPassword('slice');

    // Create hard-coded users
    const hardCodedUsers = [
      { id: '0', name: 'Admin', username: 'admin', hashedPassword: hashedAdminPassword, isAdmin: true },
      { id: '1', name: 'Actually Toxic', username: 'at', hashedPassword: hashedToxicPassword, isAdmin: false },
      { id: '2', name: 'TooPro Noob', username: 'tpn', hashedPassword: hashedNoobPassword, isAdmin: false },
      { id: '3', name: 'CrispyAppleSlice', username: 'cas', hashedPassword: hashedSlicePassword, isAdmin: false }
    ];

    // Insert hard-coded users into the database
    try {
      const savedUsers = await User.insertMany(hardCodedUsers);
      console.log('Saved users:', savedUsers);
    } catch (error) {
      console.error('Error saving users:', error);
    }

    // Save your posts to the database
    try {
      const savedPosts = await Post.insertMany(posts);
      console.log('Saved posts:', savedPosts);
    } catch (error) {
      console.error('Error saving posts:', error);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.log(e.message);
  }
};


app.use(bodyParser.json());
app.use(cors(corsOptions));
start();