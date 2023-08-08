import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk'; // Import ThunkDispatch
import { AnyAction } from 'redux'; // Import AnyAction
import { fetchPosts, selectPendingPosts } from '../../features/posts/postsSlice'; // Import the fetchPosts thunk
import { RootState } from '../../app/store'; // Make sure to import RootState
import axios from 'axios';


import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

const ReviewPage: React.FC = () => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch(); // Use ThunkDispatch
  const pendingPosts = useSelector((state: RootState) => selectPendingPosts(state));

  useEffect(() => {
    dispatch(fetchPosts()); // Fetch all posts, including pending ones
  }, [dispatch]);

 
  const handleApprove = async (postId: string) => {
    try {
      // Send a request to update the moderated status of the post to true (approved)
      await axios.put(`http://localhost:3000/api/posts/${postId}/status`, { moderated: true });
      
      // Once the moderated status is updated, you can navigate to the review page again
      navigate('/api/posts/non-moderated'); // Assuming you have a route named 'review' for this component
    } catch (error) {
      console.error('Error approving post:', error);
      // Handle the error as needed
    }
  };
  













  return (
    <div>
      <h2>Review Pending Posts</h2>
      <ul>
        {pendingPosts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <button onClick={() => handleApprove(post.id)}>Approve</button>
            {/* <button onClick={() => handleReject(post.id)}>Reject</button> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewPage;
