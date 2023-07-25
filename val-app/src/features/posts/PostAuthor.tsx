import React from 'react';
import { useSelector } from 'react-redux';

interface User {
  id: string;
  name: string;
}

interface RootState {
  users: User[];
}

interface PostAuthorProps {
  userId: string;
}

export const PostAuthor: React.FC<PostAuthorProps> = ({ userId }) => {
  const author = useSelector((state: RootState) =>
  state.users.find((user) => user.id === userId)
  );
  
  return <span>by {author ? author.name : 'Unknown author'}</span>;
};
