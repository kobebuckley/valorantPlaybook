import React, { useState, useEffect, ChangeEvent, useContext, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Post, fetchPosts, postUpdated, selectPostById } from './postsSlice';
import { AppDispatch, RootState } from '../../app/store';
import { User, selectLoggedInUser, setLoggedInUser } from '../users/usersSlice';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'; // Import the correct package and functions
import { auth, db } from '../../firebase/firebase-config';
import { AuthContext } from '../../context/auth-context';
import ErrorModal from './ErrorModal';
import PostDeleteButton from './PostDeleteButton';

const postsCollectionRef = collection(db, 'posts');

export const EditPostForm: React.FC = () => {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const postsCollectionRef = collection(db, 'posts');
  const { currentUser } = useContext(AuthContext);
  const displayName = currentUser?.displayName || '';
  const [selectedDisplayName, setSelectedDisplayName] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Only need the ID parameter here

  const post: Post | undefined = useSelector((state: RootState) =>
    id ? selectPostById(state, id) : undefined
  );

  console.log("Selected post:", post);
  
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || ''); 
  const [videoUrl, setVideoUrl] = useState(post?.videoUrl || '');
  const [agent, setAgent] = useState(post?.agent || '')
  const [selectedDocData, setSelectedDocData] = useState<any | null>(null);

  console.log("Selected post:", post);

  useEffect(() => {
    const fetchData = async () => {
      if (!post && id) {
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

      try {
        const querySnapshot = await getDocs(collection(db, 'posts'));
        let foundSelectedDocData = null;

        querySnapshot.docs.forEach(doc => {
          const postRef = doc
          const postData = doc.data();
          if (postData.id == post?.id) {
            foundSelectedDocData = postRef;

          }
        });

        setSelectedDocData(foundSelectedDocData);
        if (foundSelectedDocData) {
          console.log("Selected Document Data:", foundSelectedDocData);
          return
        } else {
          console.log("No document with matching ID found.");
        }
      } catch (error) {
        console.error("Error fetching and logging collection:", error);
      }
    };

    fetchData();
  }, [dispatch, id, post]);


  
  // console.log('TEST HERE',selectedDocData.id)
    console.log('The Doc that will be updated',selectedDocData)

  // const postDocRef = doc(db, 'posts', selectedDocData.id);

  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onVideoUrlChanged = (e: ChangeEvent<HTMLInputElement>) => setVideoUrl(e.target.value);
  const onAgentChanged = (e: ChangeEvent<HTMLSelectElement>) => setAgent(e.target.value);
  const onPostTextChanged = (e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);

  const onUpdatePostClicked = async () => {
    if (!auth.currentUser || !post || !selectedDocData) {
      return;
    }
  
    try {
      if (title && content && videoUrl && agent && post) {
        const timestamp = new Date().toISOString();
  
        const updatedPostPayload: {
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
          moderated: false,
        };

        const docRef = doc(db, 'posts', selectedDocData.id); // Modify this line
        await updateDoc(docRef, updatedPostPayload);
        dispatch(postUpdated(updatedPostPayload));
        console.log('PostDoc', selectedDocData)
        setShowSuccessMessage(true);
        console.log("SUCCESS");
        navigate('/');
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };
  
  
  return (  
  <div className="bg-gray-900 min-h-screen flex items-center justify-center">

     <section className="mt-16 p-4 bg-gray-700 text-gray-200 rounded shadow-lg mx-auto w-full md:max-w-3xl">
      <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Edit Your Article</h1>
        {currentUser ? (
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                       <label htmlFor="agentSelect" className="block font-semibold mb-2 text-xl text-center">
                {/* Agent: */}
              </label>
              <select
                id="agentSelect"
                name="agentSelect"
                value={agent}
                onChange={onAgentChanged}
                className="border border-gray-800 rounded p-2 w-full bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">             
                <option disabled value="">Select an agent</option>

                <option value="gekko">Gekko</option>
                <option value="fade">Fade</option>
              </select>
            </div>
           <div className="mb-4">
          <label htmlFor="postTitle" className="block font-semibold mb-2 text-xl text-center">
                {/* Post Title: */}
              </label>
              <input
                type="text"
                id="postTitle"
                name="postTitle"
                value={title}
                onChange={onTitleChanged}
                className="border border-gray-800 rounded p-2 mb-2 w-full bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter the game title"              />
            </div>
            <div className="mb-4">
           <label htmlFor="postContent" className="block font-semibold mb-2 text-xl text-center">
                Content:
              </label>
              <textarea
                id="postContent"
                name="postContent"
                value={content}
                onChange={onPostTextChanged}
                className="border border-gray-800 rounded p-4 mb-2 w-full h-48 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your article here..." rows={6}
              />
            </div>


        <div className="mb-4">
               <label htmlFor="postVideo" className="block font-semibold mb-2 text-xl text-center">
                Video:
              </label>
              <input
                type="text"
                id="videoUrlContent"
                name="videoUrlContent"
                value={videoUrl}
                onChange={onVideoUrlChanged}
                className="border border-gray-800 rounded p-2 mb-2 w-full bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Paste video URL here"              />
            </div>
            <div className="mt-4">
              <div className="flex justify-center mt-2 space-x-2">
              <button
                type="button"
                onClick={onUpdatePostClicked}
                className=" bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 cursor-pointer" 
                disabled={!currentUser}
              >
                Save Post
              </button>
              
                <Link
                  to={`/posts/${agent}/${id}`}
                  className=" bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 cursor-pointer" 
                >
                  Cancel
                </Link>
                <PostDeleteButton />
              </div>
              </div>
          </form>
        ) : (
          <ErrorModal onClose={() => setShowErrorModal(false)} message={''} />
          )}
      </div>
    </section>
    </div>
  );
};

    
export default EditPostForm; 