import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { reactionAdded } from './postsSlice';
import { Post, fetchPosts, postUpdated, selectPostById } from './postsSlice';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '../../firebase/firebase-config';
import { AppDispatch } from '../../app/store';
import { useParams } from 'react-router-dom';

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
export const ReactionButtons: React.FC<ReactionButtonsProps> = ({ post }) => {
  const [selectedDocData, setSelectedDocData] = useState<any | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>(); // Only need the ID parameter here

console.log("Selected post:", post);


useEffect(() => {
  const fetchData = async () => {
    // if (!post && id) {
    //   try {
    //     await dispatch(fetchPosts());
    //   } catch (error) {
    //     console.error('Error fetching posts:', error);
    //   }
    // }

    // if (post) {
    //   setTitle(post.title);
    //   setContent(post.content);
    //   setVideoUrl(post.videoUrl);
    //   setAgent(post.agent);
    // }

    try {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      let foundSelectedDocData = null;

      querySnapshot.docs.forEach(doc => {
        const postRef = doc
        const postData = doc.data();
        if (postData.id == post?.id) {
          foundSelectedDocData = postRef;

        }
        // console.log("Post Id:", postData.id);
      });

      setSelectedDocData(foundSelectedDocData);
      if (foundSelectedDocData) {
        console.log("Selected Document Data:", foundSelectedDocData);
        return
      } else {
        console.log("No document with matching ID found.");
      }
    } catch (error) {
      console.error("Error fetching and logging collection:", error);
    }
  };

  fetchData();
}, [dispatch, id, post]);



// console.log('TEST HERE',selectedDocData.id)
  console.log('The Doc that will be updated',selectedDocData)
  

// update me as well

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
