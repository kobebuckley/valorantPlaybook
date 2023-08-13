import React from 'react';
import { useDispatch } from 'react-redux';
import { reactionAdded } from './postsSlice';

interface Post {
  id: string;
  date: string;
  title: string;
  content: string;
  videoUrl: string;
  agent: string;
  userId: string;
  reactions: { [key: string]: number };
}

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
};

interface ReactionButtonsProps {
  post: Post;
}
// update me as well
export const ReactionButtons: React.FC<ReactionButtonsProps> = ({ post }) => {
  const dispatch = useDispatch();

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className="muted-button reaction-button"
        onClick={() =>
          dispatch(reactionAdded({ postId: post.id, reaction: name }))
        }
      >
        {emoji} {post.reactions[name as keyof typeof reactionEmoji]}
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};
