import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';
import YouTube from 'react-youtube';
import { RootState, AppDispatch } from '../../app/store';
// import { PostAuthor } from './PostAuthor';
import { TimeAgo } from './TimeAgo';
import { ReactionButtons } from './ReactButton';
import { fetchPosts, selectAllPosts } from './postsSlice';
import { selectLoggedInUser, setLoggedInUser } from '../users/usersSlice'; // Update with the correct path

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export const AgentPostsPage: React.FC = () => {
  const { agent } = useParams<{ agent?: string }>();
  console.log("Selected Agent:", agent);

  const dispatch: AppDispatch = useDispatch();
  const posts = useTypedSelector(selectAllPosts);
  const postStatus = useTypedSelector((state) => state.posts.status);

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
      <article className="post-excerpt p-6 bg-gray-900 text-white rounded shadow-lg" key={post.id}> 
          <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
          {/* <h2 className="text-3xl font-bold mb-4">{post.displayName}</h2> */}
          <div><span>by {`${post.displayName || 'Unknown author'}`}</span></div>
          <TimeAgo timestamp={post.date}/>
          {videoId && (
            <div className="flex justify-center mb-6">
              <YouTube videoId={videoId} />
            </div>
          )}
          <p className="post-content">{post.content.substring(0, 100)}</p>
          <div className="mt-4"> 
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
        </article>
      );
    });


  return (
    <section className="bg-gray-900 min-h-screen py-10">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-white text-center tracking-wider">
          Posts for {agent}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {renderedPosts}
        </div>
      </div>
    </section>
  );
};

export default AgentPostsPage;
