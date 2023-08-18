import React, { useState, useEffect, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Post, postUpdated, selectPostById } from './postsSlice';
import { RootState } from '../../app/store';
import { selectLoggedInUser, setLoggedInUser } from '../users/usersSlice';
import { doc, updateDoc } from 'firebase/firestore'; // Import the correct package and functions
import { db } from '../../firebase/firebase-config';

export const EditPostForm: React.FC = () => {
  const { agent, id } = useParams<{ agent: string; id: string }>();
  console.log("Selected id:", id);
  console.log("Selected Agent:", agent);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const post: Post | undefined = useSelector((state: RootState) =>
    id ? selectPostById(state, id) : undefined
  );

  console.log("Selected post:", post);

  if (!id) {
   
    return <p>Error: Post ID is not defined.</p>; // Replace this with your error handling
  }

  const loggedInUser = useSelector(selectLoggedInUser);

  const [title, setTitle] = useState(post?.title || '');
  const [postText, setPostText] = useState(post?.content || ''); // Changed to postText
  const [videoUrl, setVideoUrl] = useState(post?.videoUrl || '');
  const [selectedAgent, setSelectedAgent] = useState(post?.agent || '');

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setPostText(post.content);
      setVideoUrl(post.videoUrl);
      setSelectedAgent(post.agent);
    }
  }, [post]);

  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onVideoUrlChanged = (e: ChangeEvent<HTMLInputElement>) => setVideoUrl(e.target.value);
  const onAgentChanged = (e: ChangeEvent<HTMLSelectElement>) => setSelectedAgent(e.target.value);
  const onPostTextChanged = (e: ChangeEvent<HTMLTextAreaElement>) => setPostText(e.target.value);
  useEffect(() => {
    // if (!loggedInUser) {
    //   navigate('/login'); // Redirect to login if the user is not logged in
    // }

    // Rest of your useEffect code
  }, [loggedInUser, navigate]);
  const onUpdatePostClicked = async () => {
    if (post && title && postText && videoUrl && selectedAgent) {
      const updatedPost: Partial<Post> = { // Use Partial<Post> here
        title,
        content: postText,
        videoUrl,
        agent: selectedAgent,
      };
  
      await updateDoc(doc(db, 'posts', id), updatedPost);
      dispatch(postUpdated(updatedPost as Post)); // Cast updatedPost as Post
      navigate(`/posts/${selectedAgent}/${id}`);
    }
  };
  
  

  const isAuthor = loggedInUser && loggedInUser.id == post?.userId;
  console.log(isAuthor)

  return (
    <section className="bg-gray-900 min-h-screen py-10">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-white">Edit Post</h2>
        {isAuthor ? ( // Render the form if the user is the author
          <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="agentSelect" className="text-lg text-white">
              Agent:
            </label>
            <select
              id="agentSelect"
              name="agentSelect"
              value={selectedAgent}
              onChange={onAgentChanged}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="gekko">Gekko</option>
              <option value="fade">Fade</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="postTitle" className="text-lg text-white">
              Post Title:
            </label>
            <input
              type="text"
              id="postTitle"
              name="postTitle"
              placeholder="What's on your mind?"
              value={title}
              onChange={onTitleChanged}
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="postContent" className="text-lg text-white">
              Content:
            </label>
            <textarea
              id="postContent"
              name="postContent"
              value={postText}
              onChange={onPostTextChanged}
              className="border border-gray-300 rounded-md p-2"
              rows={6}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="videoUrlContent" className="text-lg text-white">
              Video:
            </label>
            <input
              type="text"
              id="videoUrlContent"
              name="videoUrlContent"
              value={videoUrl}
              onChange={onVideoUrlChanged}
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={onUpdatePostClicked}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={loggedInUser.id !== post.userId && !loggedInUser.isAdmin}
            >
              Save Post
            </button>
            <Link to={`/posts/${selectedAgent}/${id}`} className="px-4 py-2 ml-2 text-blue-500 hover:text-blue-700">
              Cancel
            </Link>
          </div>
        </form>
              ) : (
                <p>You don't have permission to edit this post.</p>
              )}
            </div>
          </section>
        );
      };
    
    
export default EditPostForm; 