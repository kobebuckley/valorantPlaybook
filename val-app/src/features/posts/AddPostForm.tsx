import React, { useState, useEffect, useContext, ChangeEvent, FormEvent } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import ErrorModal from './ErrorModal';
import { auth, db } from '../../firebase/firebase-config';
import { User, setLoggedInUser } from '../users/usersSlice';




import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';

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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      const userToStore: User = {
        id: currentUser.uid, 
        name: currentUser.displayName || '',
        username: '', 
        hashedPassword: '', 
        isAdmin: false, 

      };
      dispatch(setLoggedInUser(userToStore));
    }
  }, [currentUser, dispatch]);
  
  const onAgentChanged = (e: ChangeEvent<HTMLSelectElement>) => setAgent(e.target.value);
  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);


  const [sanitizedContent, setSanitizedContent] = useState<string>('');

  const onPostTextChanged = (newContent: string) => {
    setPostText(newContent);
    const sanitized = DOMPurify.sanitize(newContent);
    setSanitizedContent(sanitized);
  };

  const createPost = async () => {
    if (!auth.currentUser) {
      return;
    }
  
    try {
      const timestamp = new Date().toISOString();
      const newPost = {
        id: Date.now(), 
        date: timestamp,
        title,
        content: sanitizedContent, 
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
  
    await createPost(); 
  };



  const canSave = Boolean(title) && Boolean(postText) && Boolean(videoUrl) && Boolean(agent);
  const isSaveButtonDisabled = !canSave;

  function RenderFormattedContent({ postText }) {
    const sanitizedContent = DOMPurify.sanitize(postText);
    return (
      <div className="rendered-content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    );
  }  

 
 
  return (
    <div className="bg-gray-800 min-h-screen flex items-center justify-center">
      <section className="mt-16 p-4 bg-gray-700 text-gray-200 rounded shadow-lg mx-auto w-full md:max-w-3xl">
        <h1 className="text-3xl font-bold mb-4 text-center">Share Your Notes</h1>

        {!auth.currentUser && (
          <ErrorModal onClose={() => setShowErrorModal(false)} message={''} />
        )}

        <form onSubmit={handleSubmit} className="w-full mx-auto">
          <div className="mb-4">
            <label htmlFor="agentSelect" className="block font-semibold mb-2 text-xl text-center">
              Select Agent
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

              <option value="breach">Breach</option>
              <option value="deadlock">Deadlock</option>

              <option value="raze">Raze</option>
              <option value="chamber">Chamber</option>

              <option value="kay/o">Kay/o</option>
              <option value="skye">Skye</option>

              <option value="cypher">Cypher</option>
              <option value="sova">Sova</option>

              <option value="killjoy">Killjoy</option>
              <option value="harbor">Harbor</option>

              <option value="viper">Viper</option>
              <option value="phoenix">Phoenix</option>

              <option value="astra">Astra</option>
              <option value="brimstone">Brimstone</option>

              <option value="neon">Neon</option>
              <option value="yoru">Yoru</option>
              

              <option value="sage">Sage</option>
              <option value="reyna">Reyna</option>

              <option value="omen">Omen</option>
              <option value="jett">Jett</option>

            </select>
          </div>

          <div className="mb-4">  
            <label htmlFor="postTitle" className="block font-semibold mb-2 text-xl text-center">
              Game Title
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
              Notes
            </label>

            <div>
  <ReactQuill value={postText} onChange={onPostTextChanged} />
  <RenderFormattedContent postText={sanitizedContent} /> {/* Render formatted content */}
</div>

            {/* <textarea
              id="postContent"
              name="postContent"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              required
              className="border border-gray-800 rounded p-4 mb-2 w-full h-48 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your article here..."
              >
            </textarea> */}
          </div>

          <div className="mb-4">
            <label htmlFor="postVideo" className="block font-semibold mb-2 text-xl text-center">
              Video URL
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
            Publish Notes
          </button>
        </form>

        {showSuccessMessage && (
          <p className="text-green-500 mt-4 text-center">Notes published successfully!</p>
        )}
      </section>
    </div>
  );
}

export default AddPostForm;


