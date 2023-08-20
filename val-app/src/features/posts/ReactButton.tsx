import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { reactionAdded } from './postsSlice';
import { Post, fetchPosts, postUpdated, selectPostById } from './postsSlice';
import { collection, doc, getDocs, updateDoc } from '@firebase/firestore';
import { auth, db } from '../../firebase/firebase-config';
import { AppDispatch } from '../../app/store';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';

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
  const { currentUser } = useContext(AuthContext);
  const [selectedDocData, setSelectedDocData] = useState<any | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>(); // Only need the ID parameter here

console.log("Selected post:", post);

const [reactions, setReactions] = useState(post?.reactions || {}); // Initialize with post.reactions

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



  
  const onUpdatePostClicked = async () => {
    if (!auth.currentUser || !post || !selectedDocData) {
      return;
    }
  
    try {
      if (post) {
        const timestamp = new Date().toISOString();
  
        const updatedPostPayload: {
          id: string;
          displayName: string;
          date: string;
          title: string;
          content: string;
          videoUrl: string;
          agent: string;
          userId: string;
          reactions: { [key: string]: number };
          moderated: boolean;
        } = {
          id: post!.id,
          displayName: currentUser?.displayName || '',
          date: timestamp,
          title: post.title, // Use the local reactions object for these properties
          content: post.content,
          videoUrl: post.videoUrl,
          agent: post.agent,
          userId: currentUser?.uid || '',
          reactions: reactions, // Use the updated reactions state
          moderated: post.moderated,
        };

        const docRef = doc(db, 'posts', selectedDocData.id);
        await updateDoc(docRef, updatedPostPayload);
        
        dispatch(postUpdated(updatedPostPayload));
        console.log('Reactions updated in the database:', updatedPostPayload.reactions);
        console.log('PostDoc', selectedDocData);

        console.log("SUCCESS");
      }
    } catch (error) {
      console.error('Error updating reactions in the database:', error);

      console.error('Error updating post:', error);
    }
  };

  
  const handleReactionClick = (reactionName: string) => {
    // Update the reactions state when a reaction button is clicked
    setReactions((prevReactions) => ({
      ...prevReactions,
      [reactionName]: (prevReactions[reactionName] || 0) + 1,
    }));

    // Dispatch the reaction added action
    dispatch(reactionAdded({ id: post.id, reaction: reactionName }));
    onUpdatePostClicked();

  };

// update me as well

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className="muted-button reaction-button"
        onClick={() => handleReactionClick(name)}

      >
        {emoji} {post.reactions[name as keyof typeof reactionEmoji]}
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};
