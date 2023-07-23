import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { postAdded } from './postsSlice';

interface Post {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
  agent: string;
}

export const AddPostForm: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [agent, setAgent] = useState<string>('');

  const dispatch = useDispatch();

  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onContentChanged = (e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);
  const onVideoUrlChanged = (e: ChangeEvent<HTMLInputElement>) => setVideoUrl(e.target.value);
  const onAgentChanged = (e: ChangeEvent<HTMLSelectElement>) => setAgent(e.target.value);

  const onSavePostClicked = () => {
    if (title && content && videoUrl && agent) {
      const newPost: Post = {
        id: nanoid(),
        title,
        content,
        videoUrl,
        agent,
      };

      dispatch(postAdded(title, content, videoUrl,agent));

      setTitle('');
      setContent('');
      setVideoUrl('');
      setAgent('');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSavePostClicked(); // Call onSavePostClicked here
  };

  const isSaveButtonDisabled = !agent; // Disable the button if agent is not selected

  return (
    <section className="p-4 bg-gray-900 text-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Share Your Gaming Experience</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="agentSelect" className="block font-semibold mb-2 text-xl">
          Select Agent:
        </label>
        <select
          id="agentSelect"
          name="agentSelect"
          value={agent}
          onChange={onAgentChanged}
          className="border border-gray-800 rounded p-2 mb-4 w-full bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select an agent</option>
          <option value="gekko">Gekko</option>
          <option value="fade">Fade</option>
        </select>

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
          disabled={isSaveButtonDisabled} // Disable the button when agent is not selected
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Save Post
        </button>
      </form>
    </section>
  );
};
