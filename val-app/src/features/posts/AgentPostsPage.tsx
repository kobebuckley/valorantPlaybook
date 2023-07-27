import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import YouTube from 'react-youtube';
import { AddPostForm } from './AddPostForm'; // Import the AddPostForm component
import { PostAuthor } from './PostAuthor';
import { TimeAgo } from './TimeAgo';

interface Post {
  id: string;
  date: string;
  title: string;
  content: string;
  videoUrl?: string;
  agent: string;
  userId: string;
}

export const AgentPostsPage: React.FC = () => {
  const { agent } = useParams<{ agent: string }>();
  const posts: Post[] = useSelector((state: { posts: Post[] }) => state.posts);

  const extractVideoId = (url: string): string | undefined => {
    const videoIdRegex = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/;
    const match = url.match(videoIdRegex);
    return match?.[1];
  };
  
  const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))

  const renderedPosts = orderedPosts
    .filter((post) => post.agent === agent)
    .map((post) => {
      const videoId = post.videoUrl ? extractVideoId(post.videoUrl) : undefined;

      return (
        <article className="post-excerpt p-6 bg-gray-900 text-white rounded shadow-lg" key={post.id}>
          <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
        <TimeAgo timestamp={post.date}/>
          <PostAuthor userId={post.userId} />
          {videoId && (
            <div className="flex justify-center mb-6">
              <YouTube videoId={videoId} />
            </div>
          )}
          <p className="post-content">{post.content.substring(0, 100)}</p>
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
        {/* <div className="mt-8">
          <AddPostForm agent={agent} /> 
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {renderedPosts}
        </div>
      </div>
    </section>
  );
};

export default AgentPostsPage;
