import React from 'react';
import { useDispatch } from 'react-redux';
import { reactionAdded } from './postsSlice';
import { Post, fetchPosts, postUpdated, selectPostById } from './postsSlice';

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
          dispatch(reactionAdded({ id: post.id, reaction: name }))
        }
      >
        {emoji} {post.reactions[name as keyof typeof reactionEmoji]}
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};
