import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';
import YouTube from 'react-youtube';


// import { PostAuthor } from './PostAuthor';
import { TimeAgo } from './TimeAgo';
import { ReactionButtons } from './ReactButton';


import { RootState, AppDispatch } from '../../app/store';
import { fetchPosts, selectAllPosts } from './postsSlice';
import { selectLoggedInUser, setLoggedInUser } from '../users/usersSlice'; 
import PostDeleteButton from './PostDeleteButton';

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export const AgentPostsPage: React.FC = () => {
  const { agent } = useParams<{ agent?: string }>();
  console.log("Selected Agent:", agent);

  const dispatch: AppDispatch = useDispatch();
  const posts = useTypedSelector(selectAllPosts);
  
  
  const postStatus = useTypedSelector((state) => state.posts.status);
  console.log("Posts Status:", postStatus);
  
  const loggedInUser = useSelector(selectLoggedInUser);
  console.log('loggedInUser:', loggedInUser);
  
  useEffect(() => {
    const loggedInUserStr = localStorage.getItem('loggedInUser');
    if (loggedInUserStr) {
      const loggedInUser = JSON.parse(loggedInUserStr);
      dispatch(setLoggedInUser(loggedInUser));
    }
    const fetchAgentPosts = async () => {
      if (postStatus === 'idle' && agent) {
        try {
          await dispatch(fetchPosts());
        } catch (error) {
          // Handle error
        }
      }
    };
    
    fetchAgentPosts();
  }, [postStatus, dispatch, agent]);
  
  const agentPosts = posts.filter((post) => post.agent === agent);
  
  if (postStatus === 'loading' || postStatus === 'idle') {
    return (
      <section className="bg-gray-900 min-h-screen py-10">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-white text-center tracking-wider">
            Loading...
          </h2>
        </div>
      </section>
    );
  }
  
  if (agentPosts.length === 0) {
    return (
      <section className="bg-gray-900 min-h-screen py-10">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-white text-center tracking-wider">
            No posts available for {agent}
          </h2>
        </div>
      </section>
    );
  }
  
  const extractVideoId = (url: string): string | undefined => {
    const videoIdRegex = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/;
    const match = url.match(videoIdRegex);
    return match?.[1];
  };
  
  const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
  
  
  const renderedPosts = orderedPosts
  .filter((post) => post.moderated === true) 
  .map((post) => {
    
    const videoId = post.videoUrl ? extractVideoId(post.videoUrl) : undefined;
    
    return (
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
              <p className="post-content text-gray-300 text-center max-w-[750px] w-full">
                {post.content.substring(0, 300)}{post.content.length > 300 ? '...' : ''}</p>
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
    );
  });

return (
  <section className="bg-gray-800 min-h-screen py-10  ">
    <div className="container mx-auto text-center max-w-[1000px] ">
    <h2 className="text-6xl font-bold mb-16 text-white text-center tracking-wider">
        Posts for {agent}
      </h2>
      {/* <div className="bg-orange-600 flex flex-col justify-center items-center max-w-[1000px]"> */}
        {renderedPosts}
      {/* </div> */}
    </div>
  </section>
);
};

export default AgentPostsPage;
