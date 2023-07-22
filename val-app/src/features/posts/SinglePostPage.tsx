import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import YouTube from 'react-youtube';

interface Post {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
}

export const SinglePostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const posts: Post[] = useSelector((state: { posts: Post[] }) => state.posts);

  const extractVideoId = (url: string): string | undefined => {
    const videoIdRegex = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/;
    const match = url.match(videoIdRegex);
    return match?.[1];
  };

  const post: Post | undefined = posts.find((post) => post.id === postId);

  if (!post) {
    return <h1>Post not found</h1>;
  }

  const videoId = post.videoUrl ? extractVideoId(post.videoUrl) : undefined;

  return (
<article className="post-excerpt p-6 bg-gray-900 text-white rounded shadow-lg" key={post.id}>
        {/* Center the video */}
        <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
        {videoId && (
          <div className="flex justify-center mb-6">
            <YouTube videoId={videoId} />
          </div>
        )}
      <p className="post-content">{post.content.substring(0, 100)}</p>
        
      <Link to={`/editPost/${post.id}`} className="text-blue-500 hover:text-blue-700">
          Edit Post
      </Link>
      </article>

  );
};

export default SinglePostPage;
