import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import YouTube from 'react-youtube';
// import { PostAuthor } from './PostAuthor';
import { TimeAgo } from './TimeAgo';
import { ReactionButtons } from './ReactButton';

//update next


import { selectPostById, Post } from './postsSlice';
import { RootState, AppDispatch } from '../../app/store';
import { fetchPosts, selectAllPosts } from './postsSlice';
import { selectLoggedInUser, setLoggedInUser } from '../users/usersSlice'; 

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;


export const SinglePostPage: React.FC = () => {
  const { agent, id } = useParams<{ agent: string; id: string }>();
  console.log("Selected id:", id);
  console.log("URL id:", id);

  console.log("Selected Agent:", agent);

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
          // Handle error
        }
      }
    };

    fetchAgentPosts();
  }, [dispatch, agent]);
  
  // Use the selector and explicitly define the type for the state
  // const post: Post | undefined = useSelector((state: RootState) =>
  // id ? selectPostById(state, id) : undefined
  // );



  const posts = useTypedSelector(selectAllPosts);
console.log('The grabbed posts', posts);

if (posts.length === 0) {
  return <div>Loading...</div>;
}
const decodedId = decodeURIComponent(id ?? ''); 
const post = posts.find((post) => post.id == decodedId);

// console.log("URL id:", id);
// posts.forEach((post) => {
//   console.log("Post id:", post.id);
// });

// console.log('The url id', decodedId); // Use decodedId instead of id
// console.log('The single post', post);

  
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
    <section className="bg-gray-900 min-h-screen py-10">
      <div className="container mx-auto">
        <article className="post-excerpt p-6 bg-gray-900 text-white rounded shadow-lg" key={post.id}>
          <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
          {/* <PostAuthor userId={post.userId} /> */}
          <TimeAgo timestamp={post.date} />
          {videoId ? (
            <div className="flex justify-center mb-6">
              <YouTube videoId={videoId} />
            </div>
          ) : null}
          <p className="post-content">{post.content.substring(0, 100)}</p>
          <div className="mt-4"> {/* New div to create a new line */}
            <ReactionButtons post={post} />
          </div>
          <Link to={`/editPost/${agent}/${post.id}`} className="text-blue-500 hover:text-blue-700">
            Edit Post
          </Link>
        </article>
      </div>
    </section>
  );
};

export default SinglePostPage;
