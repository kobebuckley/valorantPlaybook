import React, { useState, useEffect, ChangeEvent, useContext, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Post, fetchPosts, postUpdated, selectPostById } from './postsSlice';
import { AppDispatch, RootState } from '../../app/store';
import { User, selectLoggedInUser, setLoggedInUser } from '../users/usersSlice';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore'; // Import the correct package and functions
import { auth, db } from '../../firebase/firebase-config';
import { AuthContext } from '../../context/auth-context';
import ErrorModal from './ErrorModal';


export const EditPostForm: React.FC = () => {
  // const [title, setTitle] = useState('');
  // const [postText, setPostText] = useState('');
  // const [videoUrl, setVideoUrl] = useState('');
  // const [agent, setAgent] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const postsCollectionRef = collection(db, 'posts');
  const { currentUser } = useContext(AuthContext);
  const displayName = currentUser?.displayName || '';
  const [selectedDisplayName, setSelectedDisplayName] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();



  // const { agent, id } = useParams<{ agent: string; id: string }>();

  const { id } = useParams<{ id: string }>(); // Only need the ID parameter here

  const posts = useSelector((state: RootState) => state.posts.posts);

  const post: Post | undefined = useSelector((state: RootState) =>
    id ? selectPostById(state, id) : undefined
  );

  console.log("Selected post:", post);

  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || ''); 
  const [videoUrl, setVideoUrl] = useState(post?.videoUrl || '');
  const [agent, setAgent] = useState(post?.agent || '')


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
        setContent(post.content);
        setVideoUrl(post.videoUrl);
        setAgent(post.agent);
      }
    };
  
    fetchData();
  }, [dispatch, posts, post]);
  

  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onVideoUrlChanged = (e: ChangeEvent<HTMLInputElement>) => setVideoUrl(e.target.value);
  const onAgentChanged = (e: ChangeEvent<HTMLSelectElement>) => setAgent(e.target.value);
  const onPostTextChanged = (e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);

  // useEffect(() => {
  //   if (currentUser) {
  //     const userToStore: User = {
  //       id: currentUser.uid, // You might need to adjust this property name
  //       name: currentUser.displayName || '',
  //       username: '', // Fill in the appropriate value if needed
  //       hashedPassword: '', // Fill in the appropriate value if needed
  //       isAdmin: false, //! Fill in the appropriate value if needed (strange maybe needs a change later)
  //       // ... other properties from the User type
  //     };
  //     dispatch(setLoggedInUser(userToStore));
  //   }
  // }, [currentUser, dispatch]);
  



  const onUpdatePostClicked = async () => {
    if (!auth.currentUser || !post) {
      return;
    }
  
    let postPayload;
  
    try {
      if (title && content && videoUrl && agent && post) {
        const timestamp = new Date().toISOString();
        const postPayload: {
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
          // status: PostStatus;
        } = {
          id: post!.id,
          displayName: currentUser?.displayName || '',
          date: timestamp,
          title,
          content,
          videoUrl,
          agent,
          userId: currentUser?.uid || '',
          reactions: post!.reactions, 
          moderated: post!.moderated,
          // status: post!.status,
        };
        
        setTitle('');
        setContent('');
        setVideoUrl('');
        setAgent('');
        setShowSuccessMessage(true);
        console.log("SUCCESS");
        navigate('/');
        await updateDoc(doc(db, 'posts', id!), postPayload);
        
        dispatch(postUpdated(postPayload));
        navigate(`/posts/${agent}/${id}`);
      }
  
    } catch (error) {
      console.error('Error updating post:', error);
    }
    
    const docRef = doc(db, 'posts', id!);
    const snapshot = await getDoc(docRef);
  
    console.log(`Snapshot is: ${snapshot.id}`);
    console.log(`DocRef is: ${docRef.id}`);
  };
  
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
              value={agent}
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
              value={content}
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
            <Link to={`/posts/${agent}/${id}`} className="px-4 py-2 ml-2 text-blue-500 hover:text-blue-700">
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