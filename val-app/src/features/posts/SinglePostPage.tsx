import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import YouTube from 'react-youtube';
import { TimeAgo } from './TimeAgo';
import { ReactionButtons } from './ReactButton';




import { RootState, AppDispatch } from '../../app/store';
import { fetchPosts, selectAllPosts } from './postsSlice';
import { selectLoggedInUser, setLoggedInUser } from '../users/usersSlice'; 

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;


export const SinglePostPage: React.FC = () => {
  const { agent, id } = useParams<{ agent: string; id: string }>();


  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const loggedInUserStr = localStorage.getItem('loggedInUser');
    if (loggedInUserStr) {
      const loggedInUser = JSON.parse(loggedInUserStr);
      dispatch(setLoggedInUser(loggedInUser));
    }
    const fetchAgentPosts = async () => {
      if (agent) {
        try {
          await dispatch(fetchPosts());
        } catch (error) {
        }
      }
    };

    fetchAgentPosts();
  }, [dispatch, agent]);
  

const posts = useTypedSelector(selectAllPosts);

if (posts.length === 0) {
  return <div>Loading...</div>;
}
const decodedId = decodeURIComponent(id ?? ''); 
const post = posts.find((post) => post.id == decodedId);
  
  const extractVideoId = (url: string): string | undefined => {
    const videoIdRegex = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?/]+)/;
    const match = url.match(videoIdRegex);
    return match?.[1];
  };

  if (!post) {
    return <h1>Post not found</h1>;
  }

  const videoId = post.videoUrl ? extractVideoId(post.videoUrl) : undefined;

  return (
    <section className="bg-gray-800 py-10 w-full h-full ">

      <article className=" bg-gray-700 text-white rounded  p-6 flex flex-col justify-between items-center h-full mb-4  w-full"  key={post.id}>
            <div className="p-6 mb-0 bg-gray-800 text-white rounded shadow-lg flex flex-col justify-between items-center h-full w-full">
    
      <h2 className="text-2xl font-semibold mb-2 w-full" >{post.title}</h2>
      <div className=" max-w-[750px] w-full">
          by {post.displayName || 'Unknown author'}
        </div>
        <div className='text-center w-full'>
    
        <TimeAgo timestamp={post.date} />
        </div>
    
        {videoId && (
          <div className="flex justify-center my-4 max-w-[750px] w-full">
            <YouTube videoId={videoId} />
          </div>
        )}
              <p className="post-content text-gray-300 text-center max-w-[1250px] w-full">
                {post.content}</p>
        <div className="mt-2">
          <ReactionButtons post={post} />
        </div>
        <div className="flex justify-center mt-4">
          <Link
            to={`/posts/${post.agent}/${post.id}`}
            className="button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mr-2"
          >
            View Post
          </Link>
          <Link
            to={`/editPost/${post.agent}/${post.id}`}
            className="button bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Edit Post
          </Link>
        </div>
        </div>
      </article>
      </section>
    );
  }

export default SinglePostPage;
