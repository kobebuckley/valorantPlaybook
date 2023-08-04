import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

interface PostAuthorProps {
  userId: string; // This should be the userId of the post author
}

export const PostAuthor: React.FC<PostAuthorProps> = ({ userId }) => {
  const author = useSelector((state: RootState) =>
    state.users.users.find((user) => user.id === userId)
  );

  return <div><span>by {author ? author.name : 'Unknown author'}</span></div>;
};
