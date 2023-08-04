import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { postAdded } from './postsSlice';
import { RootState } from '../../app/store';

interface Post {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
  agent: string;
  userId: string;
}

interface User {
  id: string;
  name: string;
}

export const AddPostForm: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [agent, setAgent] = useState<string>('');
  const [userId, setUserId] = useState<string>('')


  const dispatch = useDispatch();

  // const users = useSelector((state: { users: string; }) => state.users)
  const users = useSelector((state: { users: User[] }) => state.users);



  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onContentChanged = (e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);
  const onVideoUrlChanged = (e: ChangeEvent<HTMLInputElement>) => setVideoUrl(e.target.value);
  const onAgentChanged = (e: ChangeEvent<HTMLSelectElement>) => setAgent(e.target.value);
  const onAuthorChanged = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = e.target.value;
    setUserId(selectedUserId || (loggedInUser ? loggedInUser.id : '')); // Set the selected user or logged-in user's id, if available
  };



  const onSavePostClicked = () => {
    if (title && content && videoUrl && agent && userId) {
      const newPost: Post = {
        id: nanoid(),
        title,
        content,
        videoUrl,
        agent,
        userId
      };

      dispatch(postAdded(title, content, videoUrl,agent,userId));

      setTitle('');
      setContent('');
      setVideoUrl('');
      setAgent('');
      // setUserId('')
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSavePostClicked(); // Call onSavePostClicked here
  };

  const isSaveButtonDisabled = !agent; // Disable the button if agent is not selected


  const canSave = Boolean(title) && Boolean(content) && Boolean(userId)

  const usersOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))


  const loggedInUser = useSelector((state: RootState) => state.users.loggedInUser);

  
  return (
    <section className="p-4 bg-gray-900 text-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Share Your Gaming Experience</h2>
      <form onSubmit={handleSubmit}>
        {/* Rest of the code */}
        
        {/* Style the Agent and Author inputs */}
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
            {usersOptions}
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
};
