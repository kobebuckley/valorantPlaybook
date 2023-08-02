import express from 'express';
import jwt from 'jsonwebtoken';
import { secretKey } from './config'; // Create this file to store your secret key
import { authenticateUser } from './authMiddleware';

const router = express.Router();

// User login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Authenticate user (validate username and password)
  const user = authenticateUser(username, password);

  if (!user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  // Generate JWT token
  const token = jwt.sign({ sub: user.id }, secretKey, { expiresIn: '1h' });

  res.json({ token });
});

// Protected route example
router.get('/protected', authenticateUser, (req, res) => {
  res.json({ message: 'You accessed a protected route' });
});

export default router;



// ? example of protecting other routes : 

// import { authenticateUser } from './authMiddleware';

// app.get('/api/posts', authenticateUser, (req, res) => {
    
//   });
  