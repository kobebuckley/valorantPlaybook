import { nanoid } from '@reduxjs/toolkit';
import { FormEvent } from 'react';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../app/store';
import { Post, postAdded, postUpdated, selectPostById } from './postsSlice';
import { User, selectLoggedInUser, setLoggedInUser } from '../users/usersSlice'; 
import ErrorModal from './ErrorModal';


  
export const AddPostForm: React.FC = () => {
  
  // useEffect(() => {
    //   const loggedInUserStr = localStorage.getItem('loggedInUser');
    //   if (loggedInUserStr) {
      //     const loggedInUser = JSON.parse(loggedInUserStr);
      //     dispatch(setLoggedInUser(loggedInUser)); 
      //   }
      // }, [dispatch]);
      
      const [title, setTitle] = useState<string>('');
      const [content, setContent] = useState<string>('');
      const [videoUrl, setVideoUrl] = useState<string>('');
      const [agent, setAgent] = useState<string>(''); 
      const [userId, setUserId] = useState<string>('');
      
      
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectLoggedInUser); 
  //   const loggedInUserStr = localStorage.getItem('loggedInUser');
    //   if (loggedInUserStr) {
      //     const loggedInUser = JSON.parse(loggedInUserStr);
      //     dispatch(setLoggedInUser(loggedInUser)); 
      //   }
      // }, [dispatch]);


      const users = useSelector((state: { users: User[] }) => state.users);

      
  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onContentChanged = (e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);
  const onVideoUrlChanged = (e: ChangeEvent<HTMLInputElement>) => setVideoUrl(e.target.value);
  const onAgentChanged = (e: ChangeEvent<HTMLSelectElement>) => setAgent(e.target.value);
  const onAuthorChanged = (e: ChangeEvent<HTMLSelectElement>) => setUserId(e.target.value)

  // const onAuthorChanged = (e: ChangeEvent<HTMLSelectElement>) => {
  //   if (loggedInUser) {
  //     setUserId(loggedInUser.id);
  //   }
  // };

  
  
  const onSavePostClicked = () => {
    // onAuthorChanged

    if (title && content && videoUrl && agent) {
      const newPost: Post = {
        id: nanoid(),
        title,
        content,
        videoUrl,
        date: new Date().toISOString(),
        agent,
        userId,
        reactions: {},
      };

      dispatch(postAdded(title, content, videoUrl, agent, userId));

      setTitle('');
      setContent('');
      setVideoUrl('');
      setAgent('');
      setUserId('');
    }
  };

  console.log('loggedInUser:', loggedInUser);



  // const [errorModalVisible, setErrorModalVisible] = useState(false);
  // const [errorMessage, setErrorMessage] = useState('');
  // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   if (!loggedInUser) {
  //     setErrorMessage('Please log in.');
  //     setErrorModalVisible(true);
  //   } else {
  //     e.preventDefault();
  //     onSavePostClicked(); // Call onSavePostClicked here
  //   }
    // } else if (!title || !content || !videoUrl || !agent) {
    //   setErrorMessage('Please fill in all the required fields.');
    //   setErrorModalVisible(true);
    // } else {
    //   onSavePostClicked();
    // }
  // };
  
  // const closeErrorModal = () => {
  //   setErrorModalVisible(false);
  // };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSavePostClicked(); // Call onSavePostClicked here
  };



  const canSave = Boolean(title) && Boolean(content) && Boolean(userId)
  const isSaveButtonDisabled = !agent; // Disable the button if agent is not selected

  // const usersOptions = users.map(user => (
  //   <option key={user.id} value={user.id}>
  //     {user.name}
  //   </option>
  // ))

  return (
    <section className="p-4 bg-gray-900 text-white rounded shadow-lg">
  <h2 className="text-2xl font-bold mb-4">Share Your Gaming Experience</h2>
  {/* {loggedInUser === null && (
    <ErrorModal message={errorMessage} onClose={closeErrorModal} />
  )} */}
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

        <div className="mb-4">
          <label htmlFor="postAuthor" className="block font-semibold mb-2 text-xl">
            Select Author:
          </label>
          <select
            id="postAuthor"
            value={userId}
            onChange={onAuthorChanged}
            className="border border-gray-800 rounded p-2 w-full bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an Author (placeholder)</option>
            {}
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
          value={content}
          onChange={onContentChanged}
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
          onChange={onVideoUrlChanged}
          className="border border-gray-800 rounded p-2 mb-4 w-full bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Paste video URL here"
        />

        <button
          type="submit"
          disabled={isSaveButtonDisabled && !canSave} // Disable the button when agent and author is not selected
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Save Post
        </button>
      </form>
    </section>
  );
  }

