import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

interface PostAuthorProps {
  userId: string; 
}

export const PostAuthor: React.FC<PostAuthorProps> = ({ userId }) => {
  const author = useSelector((state: RootState) =>
    state.users.users.find((user) => user.id === userId)
  );

  return <div><span>by {author ? author.name : 'Unknown author'}</span></div>;
};
