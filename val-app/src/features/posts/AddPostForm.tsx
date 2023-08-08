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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);


  
      const [title, setTitle] = useState<string>('');
      const [content, setContent] = useState<string>('');
      const [videoUrl, setVideoUrl] = useState<string>('');
      const [agent, setAgent] = useState<string>(''); 
      const [userId, setUserId] = useState<string>('');
      const [showErrorModal, setShowErrorModal] = useState(false); 

      
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectLoggedInUser); 

  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onContentChanged = (e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);
  const onVideoUrlChanged = (e: ChangeEvent<HTMLInputElement>) => setVideoUrl(e.target.value);
  const onAgentChanged = (e: ChangeEvent<HTMLSelectElement>) => setAgent(e.target.value);
  const onAuthorChanged = (e: ChangeEvent<HTMLSelectElement>) => setUserId(e.target.value)
  
  
  const onSavePostClicked = () => {

    if (title && content && videoUrl && agent && userId) {
     const newPost: Post = {
    id: nanoid(),
    title,
    content,
    videoUrl,
    date: new Date().toISOString(),
    agent,
    userId: loggedInUser!.id, // Use the logged-in user's id
    reactions: {},
    status: 'pending', 
    moderated: false
      };

      dispatch(postAdded(title, content, videoUrl, agent, userId));

 
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setTitle('');
        setContent('');
        setVideoUrl('');
        setAgent('');
        setUserId('');
      }, 3000); // Clear form after 3 seconds
    }
  };


  console.log('loggedInUser:', loggedInUser);


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!loggedInUser) {
      setShowErrorModal(true);
      return;
    }

    onSavePostClicked(); 
  };


  const canSave = Boolean(title) && Boolean(content) && Boolean(userId)
  const isSaveButtonDisabled = !agent; 

 

  return (
    <section className="p-4 bg-gray-900 text-white rounded shadow-lg">
  <h2 className="text-2xl font-bold mb-4">Share Your Gaming Experience</h2>
  {loggedInUser === null && (
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
            <option value={loggedInUser?.id}>{loggedInUser?.name}</option>

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
          disabled={isSaveButtonDisabled && !canSave} 
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

