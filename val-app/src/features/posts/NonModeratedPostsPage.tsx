import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Post } from './postsSlice';
import { useSelector } from 'react-redux';
import { selectLoggedInUser } from '../users/usersSlice';

const NonModeratedPostsPage: React.FC = () => {
  const [nonModeratedPosts, setNonModeratedPosts] = useState<Post[]>([]);
  const loggedInUser = useSelector(selectLoggedInUser);

  useEffect(() => {
    // Fetch non-moderated posts from the server only if the user is authenticated and an admin
    if (loggedInUser && loggedInUser.isAdmin) {
      const fetchNonModeratedPosts = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/posts/non-moderated');
          setNonModeratedPosts(response.data);
        } catch (error) {
          console.error('Error fetching non-moderated posts:', error);
        }
      };

      fetchNonModeratedPosts();
    }
  }, [loggedInUser]);

  return (
    <div>
      <h2>Non-Moderated Posts</h2>
      <ul>
        {nonModeratedPosts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NonModeratedPostsPage;
