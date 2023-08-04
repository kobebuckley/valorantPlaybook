import React from 'react';
import { useSelector } from 'react-redux';

interface User {
  id: string;
  name: string;
}

interface RootState {
  users: {
    users: User[];
  };
}

interface PostAuthorProps {
  userId: string; // This should be the userId of the post author
}

export const PostAuthor: React.FC<PostAuthorProps> = ({ userId }) => {
  const author = useSelector((state: RootState) =>
    state.users.users.find((user) => user.id === userId)
  );

  return <div><span>by {author ? author.name : 'Unknown author'}</span></div>;
};
