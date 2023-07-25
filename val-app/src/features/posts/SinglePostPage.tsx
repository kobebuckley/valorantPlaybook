import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import YouTube from 'react-youtube';
import { PostAuthor } from './PostAuthor';

interface Post {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  agent: string; 
  user: string
}

export const SinglePostPage: React.FC = () => {
  const { agent, postId } = useParams<{ agent: string; postId: string }>();
  const posts: Post[] = useSelector((state: { posts: Post[] }) => state.posts);

  const extractVideoId = (url: string): string | undefined => {
    const videoIdRegex = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/;
    const match = url.match(videoIdRegex);
    return match?.[1];
  };

  const post: Post | undefined = posts.find((post) => post.id === postId && post.agent === agent);

  if (!post) {
    return <h1>Post not found</h1>;
  }

  const videoId = post.videoUrl ? extractVideoId(post.videoUrl) : undefined;

  return (
    <section className="bg-gray-900 min-h-screen py-10">
      <div className="container mx-auto">
        <article className="post-excerpt p-6 bg-gray-900 text-white rounded shadow-lg" key={post.id}>
          <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
          <PostAuthor userId={post.user} />
          {videoId && (
            <div className="flex justify-center mb-6">
              <YouTube videoId={videoId} />
            </div>
          )}
          <p className="post-content">{post.content.substring(0, 100)}</p>

          <Link to={`/editPost/${agent}/${post.id}`} className="text-blue-500 hover:text-blue-700">
            Edit Post
          </Link>
        </article>
      </div>
    </section>
  );
};

export default SinglePostPage;
