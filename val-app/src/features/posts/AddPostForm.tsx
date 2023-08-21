import React, { useState, useEffect, useContext, ChangeEvent, FormEvent } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { useDispatch } from 'react-redux'; // Assuming useDispatch is from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import ErrorModal from './ErrorModal';
import { useAuthState } from 'react-firebase-hooks/auth'; // Import useAuthState
import { auth, db } from '../../firebase/firebase-config';
import { User, setLoggedInUser } from '../users/usersSlice';

import ReactQuill from 'react-quill'; // Import react-quill
import 'react-quill/dist/quill.snow.css'; // Import the styles for react-quill
// ... other imports


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
  const { currentUser } = useContext(AuthContext);
  const displayName = currentUser?.displayName || '';
  const [selectedDisplayName, setSelectedDisplayName] = useState<string>('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      const userToStore: User = {
        id: currentUser.uid, // You might need to adjust this property name
        name: currentUser.displayName || '',
        username: '', // Fill in the appropriate value if needed
        hashedPassword: '', // Fill in the appropriate value if needed
        isAdmin: false, //! Fill in the appropriate value if needed (strange maybe needs a change later)
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
      console.log("SUCCESS")

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
  
    await createPost(); 
  };



  const canSave = Boolean(title) && Boolean(postText) && Boolean(videoUrl) && Boolean(agent);
  const isSaveButtonDisabled = !canSave;

 
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <section className="mt-16 p-4 bg-gray-700 text-gray-200 rounded shadow-lg mx-auto w-full md:max-w-3xl">
        <h1 className="text-3xl font-bold mb-4 text-center">Share Your Article</h1>

        {!auth.currentUser && (
          <ErrorModal onClose={() => setShowErrorModal(false)} message={''} />
        )}

        <form onSubmit={handleSubmit} className="w-full mx-auto">
          <div className="mb-4">
            <label htmlFor="agentSelect" className="block font-semibold mb-2 text-xl text-center">
              Select Agent:
            </label>
            <select
              id="agentSelect"
              name="agentSelect"
              value={agent}
              onChange={onAgentChanged}
              required
              className="border border-gray-800 rounded p-2 w-full bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option disabled value="">Select an agent</option>
              <option value="gekko">Gekko</option>
              <option value="fade">Fade</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="postTitle" className="block font-semibold mb-2 text-xl text-center">
              Game Title:
            </label>
            <input
              type="text"
              id="postTitle"
              name="postTitle"
              value={title}
              onChange={onTitleChanged}
              required
              className="border border-gray-800 rounded p-2 mb-2 w-full bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the game title"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="postContent" className="block font-semibold mb-2 text-xl text-center">
              Walkthrough Details:
            </label>
            <textarea
              id="postContent"
              name="postContent"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              required
              className="border border-gray-800 rounded p-4 mb-2 w-full h-48 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your article here..."
            />
          </div>

          <div className="mb-4">
            <label htmlFor="postVideo" className="block font-semibold mb-2 text-xl text-center">
              Video URL:
            </label>
            <input
              type="text"
              id="postVideo"
              name="postVideo"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required
              className="border border-gray-800 rounded p-2 mb-2 w-full bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste video URL here"
            />
          </div>

          <button
            type="submit"
            disabled={isSaveButtonDisabled}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 cursor-pointer" 
            >
            Publish Article
          </button>
        </form>

        {showSuccessMessage && (
          <p className="text-green-500 mt-4 text-center">Article published successfully!</p>
        )}
      </section>
    </div>
  );
}
export default AddPostForm;


