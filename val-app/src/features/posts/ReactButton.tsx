import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { reactionAdded } from './postsSlice';
import { Post, fetchPosts, selectPostById } from './postsSlice';
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
  const { id } = useParams<{ id: string }>(); 


const [reactions, setReactions] = useState(post?.reactions || {}); 

useEffect(() => {
  const fetchData = async () => {

    try {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      let foundSelectedDocData = null;

      querySnapshot.docs.forEach(doc => {
        const postRef = doc
        const postData = doc.data();
        if (postData.id == post?.id) {
          foundSelectedDocData = postRef;

        }
      });

      setSelectedDocData(foundSelectedDocData);
      if (foundSelectedDocData) {
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
          title: post.title, 
          content: post.content,
          videoUrl: post.videoUrl,
          agent: post.agent,
          userId: currentUser?.uid || '',
          reactions: reactions, 
          moderated: post.moderated,
        };

        const docRef = doc(db, 'posts', selectedDocData.id);
        await updateDoc(docRef, updatedPostPayload);

      }
    } catch (error) {
      console.error('Error updating reactions in the database:', error);

      console.error('Error updating post:', error);
    }
  };

  const handleReactionClick = async (reactionName: string) => {
    setReactions((prevReactions) => ({
      ...prevReactions,
      [reactionName]: (prevReactions[reactionName] || 0) + 1,
    }));
  
    dispatch(reactionAdded({ id: post.id, reaction: reactionName }));
  
    await new Promise((resolve) => setTimeout(resolve, 1000)); 
  
 
  };
  
  useEffect(() => {
    if (reactions !== post.reactions) {
      onUpdatePostClicked();
    }
  }, [reactions, post]);


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
