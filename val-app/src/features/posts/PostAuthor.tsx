import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { fetchInitialState } from '../users/usersSlice'; // Import your fetch action
import { unwrapResult } from '@reduxjs/toolkit';
import { AppDispatch } from '../../app/store'; // Make sure you have AppDispatch properly exported
//update next

interface PostAuthorProps {
  userId: string;
}

export const PostAuthor: React.FC<PostAuthorProps> = ({ userId }) => {
  const dispatch: AppDispatch = useDispatch(); // Use the typed dispatch
  const users = useSelector((state: RootState) => state.users.users);
  const author = users.find((user) => user.id === userId);
  console.log(author?.name); // Use optional chaining here

  useEffect(() => {
    dispatch(fetchInitialState())
      .then(unwrapResult) // Unwrap the result to get the actual payload
      .then((fetchedUsers) => {
        console.log('Fetched users:', JSON.stringify(fetchedUsers));
      })
      .catch((error) => {
        console.error('Error fetching users:', error.message);
      });
  }, [dispatch]);

  return <div><span>by {author?.name || 'Unknown author'}</span></div>; // Use optional chaining here as well
};
