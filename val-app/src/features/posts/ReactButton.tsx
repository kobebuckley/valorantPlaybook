import React, { useState, useEffect, ChangeEvent, useContext, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Post, fetchPosts, postUpdated, selectPostById } from './postsSlice';
import { AppDispatch, RootState } from '../../app/store';
import { User, selectLoggedInUser, setLoggedInUser } from '../users/usersSlice';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'; // Import the correct package and functions
import { auth, db } from '../../firebase/firebase-config';
import { AuthContext } from '../../context/auth-context';
import ErrorModal from './ErrorModal';


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
export const ReactionButtons: React.FC<ReactionButtonsProps> = () => {

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const postsCollectionRef = collection(db, 'posts');
  const { currentUser } = useContext(AuthContext);
  const displayName = currentUser?.displayName || '';
  const [selectedDisplayName, setSelectedDisplayName] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Only need the ID parameter here

  const post: Post | undefined = useSelector((state: RootState) =>
    id ? selectPostById(state, id) : undefined
  );

  console.log("Selected post:", post);
  
  const [reactions, setReactions] = useState(post?.reactions || {});

  const [selectedDocData, setSelectedDocData] = useState<any | null>(null);

  console.log("Selected post:", post);

  useEffect(() => {
    const fetchData = async () => {
      if (!post && id) {
        try {
          await dispatch(fetchPosts());
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }

      if (post) {
        setReactions(post.reactions);
      }

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

  // const postDocRef = doc(db, 'posts', selectedDocData.id);

  // const onReactChanged = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);


  const onUpdatePostClicked = async () => {
    if (!auth.currentUser || !post || !selectedDocData) {
      return;
    }
  
    try {
      if (reactions && post) {
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
          reactions: reactions, // Use the local reactions object
          moderated: true,
        };
  
        const docRef = doc(db, 'posts', selectedDocData.id);
        await updateDoc(docRef, updatedPostPayload);
        dispatch(postUpdated(updatedPostPayload));
        console.log('PostDoc', selectedDocData);
        setShowSuccessMessage(true);
        console.log('SUCCESS');
        // navigate('/');
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };
  







// update me as well
  // const dispatch = useDispatch();
  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className="muted-button reaction-button"
        onClick={onUpdatePostClicked}
      >
        {emoji} {reactions[name as keyof typeof reactionEmoji] || 0}
      </button>
    );
  });
  

  return <div>{reactionButtons}</div>;
};
