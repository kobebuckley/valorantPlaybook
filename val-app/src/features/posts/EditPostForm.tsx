import React, { useState, useEffect, ChangeEvent, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Post,PostStatus, fetchPosts, postAdded, postUpdated, selectPostById } from './postsSlice';
import { AppDispatch, RootState } from '../../app/store';
import { User, selectLoggedInUser, setLoggedInUser } from '../users/usersSlice';
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Import the correct package and functions
import { db } from '../../firebase/firebase-config';
import { AuthContext } from '../../context/auth-context';
import ErrorModal from './ErrorModal';


export const EditPostForm: React.FC = () => {
  const { agent, id } = useParams<{ agent: string; id: string }>();
  console.log("Selected id:", id);
  console.log("Selected Agent:", agent);
  const posts = useSelector((state: RootState) => state.posts.posts);

  // const dispatch = useDispatch();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);

  const post: Post | undefined = useSelector((state: RootState) =>
    id ? selectPostById(state, id) : undefined
  );

  console.log("Selected post:", post);

  const [title, setTitle] = useState(post?.title || '');
  const [postText, setPostText] = useState(post?.content || ''); // Changed to postText
  const [videoUrl, setVideoUrl] = useState(post?.videoUrl || '');
  const [selectedAgent, setSelectedAgent] = useState(post?.agent || '')


  useEffect(() => {
    const fetchData = async () => {
      if (!post && posts.length === 0) {
        try {
          await dispatch(fetchPosts());
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }
  
      if (post) {
        setTitle(post.title);
        setPostText(post.content);
        setVideoUrl(post.videoUrl);
        setSelectedAgent(post.agent);
      }
    };
  
    fetchData();
  }, [dispatch, posts, post]);
  

  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onVideoUrlChanged = (e: ChangeEvent<HTMLInputElement>) => setVideoUrl(e.target.value);
  const onAgentChanged = (e: ChangeEvent<HTMLSelectElement>) => setSelectedAgent(e.target.value);
  const onPostTextChanged = (e: ChangeEvent<HTMLTextAreaElement>) => setPostText(e.target.value);

  const onUpdatePostClicked = async () => {
    if (!id) {
      console.error("Post ID is not defined.");
      return;
    }
  
    // const postId = String(id);
  
    if (title && postText && videoUrl && selectedAgent) {
      const postPayload = {
        id: id,
        displayName: '',
        date: new Date().toISOString(),
        title,
        content: postText,
        videoUrl,
        agent: selectedAgent,
        userId: '',
        reactions: {},
        moderated: false,
        status: 'pending' as PostStatus,
      };
  
      const docRef = doc(db, 'posts', id);
      const snapshot = await getDoc(docRef);

      console.log(`Snapshot is: ${snapshot.id}`)
      console.log(`DocRef is: ${docRef.id}`)
      if (snapshot.exists()) {
        await updateDoc(docRef, postPayload);
      } else {
        console.error("Document doesn't exist:", id);
      }
  
      try {
        await updateDoc(doc(db, 'posts', id), postPayload);
        dispatch(postUpdated(postPayload));
        navigate(`/posts/${selectedAgent}/${id}`);
      } catch (error) {
        console.error('Error updating post:', error);
      }
    }
  };

  function setShowErrorModal(arg0: boolean): void {
    throw new Error('Function not implemented.');
  }

  return (
    <section className="bg-gray-900 min-h-screen py-10">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-white">Edit Post</h2>
        {currentUser ? ( // Render the form if the user is the author
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
              disabled={!currentUser}
            >
              Save Post
            </button>
            <Link to={`/posts/${selectedAgent}/${id}`} className="px-4 py-2 ml-2 text-blue-500 hover:text-blue-700">
              Cancel
            </Link>
          </div>
        </form>
              ) : (
                  <ErrorModal onClose={() => setShowErrorModal(false)} message={''} />
                )}
            </div>
          </section>
        );
      };
    
    
export default EditPostForm; 