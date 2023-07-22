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
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded p-6 mb-4">
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      {videoId && (
        <div className="flex justify-center mb-6">
          <YouTube videoId={videoId} />
        </div>
      )}
      <p className="text-gray-700">{post.content}</p>
      <div className="flex justify-between mt-4">
        <Link to={`/editPost/${post.id}`} className="text-blue-500 hover:text-blue-700">
          Edit Post
        </Link>
      </div>
    </div>
  );
};

export default SinglePostPage;
