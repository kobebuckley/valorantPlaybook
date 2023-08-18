import React, { useState, useEffect, useContext, ChangeEvent, FormEvent } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { useDispatch } from 'react-redux'; // Assuming useDispatch is from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import ErrorModal from './ErrorModal';
import { useAuthState } from 'react-firebase-hooks/auth'; // Import useAuthState
import { auth, db } from '../../firebase/firebase-config';
import { User, setLoggedInUser } from '../users/usersSlice';


interface AddPostFormProps {
  isAuth: boolean;
}

function AddPostForm(props: AddPostFormProps) {
  const [title, setTitle] = useState('');
  const [postText, setPostText] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [agent, setAgent] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const postsCollectionRef = collection(db, 'posts');
  const navigate = useNavigate();


  const { currentUser } = useContext(AuthContext);
  const displayName = currentUser?.displayName || '';
  const [selectedDisplayName, setSelectedDisplayName] = useState<string>('');
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser) {
      const userToStore: User = {
        id: currentUser.uid, // You might need to adjust this property name
        name: currentUser.displayName || '',
        username: '', // Fill in the appropriate value if needed
        hashedPassword: '', // Fill in the appropriate value if needed
        isAdmin: false, // Fill in the appropriate value if needed
        // ... other properties from the User type
      };
      dispatch(setLoggedInUser(userToStore));
    }
  }, [currentUser, dispatch]);
  

  const onAgentChanged = (e: ChangeEvent<HTMLSelectElement>) => setAgent(e.target.value);
  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);

  const createPost = async () => {
    if (!auth.currentUser) {
      return;
    }
  
    try {
      const timestamp = new Date().toISOString();
      const newPost = {
        id: Date.now(), // Unique ID for each post
        date: timestamp,
        title,
        content: postText,
        videoUrl,
        agent,
        userId: auth.currentUser.uid,
        displayName: displayName, 
        reactions: {
          thumbsUp: 0,
          hooray: 0,
          heart: 0,
          rocket: 0,
          eyes: 0,
        },
        moderated: false,
      };
      await addDoc(postsCollectionRef, newPost);
  
      setTitle('');
      setPostText('');
      setVideoUrl('');
      setAgent('');
      setShowSuccessMessage(true);
  
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    if (!currentUser) {
      setShowErrorModal(true);
      return;
    }
  
    await createPost(); // Call the createPost function to submit the post
  };
  

  const canSave = Boolean(title) && Boolean(postText) && Boolean(videoUrl) && Boolean(agent);
  const isSaveButtonDisabled = !canSave;

  return (
    <section className="p-4 bg-gray-900 text-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Share Your Gaming Experience</h2>
      {!auth.currentUser && (
        <ErrorModal onClose={() => setShowErrorModal(false)} message={''} />
      )}

        
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="agentSelect" className="block font-semibold mb-2 text-xl">
            Select Agent:
          </label>
          <select
            id="agentSelect"
            name="agentSelect"
            value={agent}
            onChange={onAgentChanged}
            className="border border-gray-800 rounded p-2 w-full bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an agent</option>
            <option value="gekko">Gekko</option>
            <option value="fade">Fade</option>
          </select>
        </div>

        <label htmlFor="postTitle" className="block font-semibold mb-2 text-xl">
          Game Title:
        </label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
          className="border border-gray-800 rounded p-2 mb-4 w-full bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter the game title"
        />

        <label htmlFor="postContent" className="block font-semibold mb-2 text-xl">
          Walkthrough Details:
        </label>
        <textarea
          id="postContent"
          name="postContent"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          className="border border-gray-800 rounded p-4 mb-4 w-full h-48 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Share your in-depth walkthrough here..."
        />

<label htmlFor="postVideo" className="block font-semibold mb-2 text-xl">
  Video URL:
</label>
<input
  type="text"
  id="postVideo"
  name="postVideo"
  value={videoUrl}
  onChange={(e) => setVideoUrl(e.target.value)}
  className="border border-gray-800 rounded p-2 mb-4 w-full bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
  placeholder="Paste video URL here"
/>

<button
  type="submit"
  disabled={isSaveButtonDisabled}
  className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
>
  Save Post
</button>
      </form>
      {showSuccessMessage && (
        <p className="text-green-500 mt-2">
          Post submitted for approval!
        </p>
      )}
    </section>
  );
}

export default AddPostForm;
