import React from 'react';
import { Link } from 'react-router-dom';
import YouTube from 'react-youtube';

export interface Post {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
  agent: string;
}

interface Props {
  posts: Post[];
}

export const PostsList: React.FC<Props> = ({ posts }) => {
  const extractVideoId = (url: string): string | undefined => {
    const match = url.match(
      /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/
    );
    return match?.[1];
  };

  const renderedPosts = posts.map((post: Post) => {
    const videoId = extractVideoId(post.videoUrl);

    return (
      <article className="post-excerpt p-6 bg-gray-900 text-white rounded shadow-lg" key={post.id}>
        <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
        {videoId && (
          <div className="flex justify-center mb-6">
            <YouTube videoId={videoId} />
          </div>
        )}
        <p className="post-content">{post.content.substring(0, 100)}</p>
        <Link to={`/posts/${post.agent}/${post.id}`} className="button muted-button">
          View Post
        </Link>
        <Link to={`/editPost/${post.agent}/${post.id}`} className="button muted-button">
          Edit Post
        </Link>
      </article>
    );
  });

  return (
    <section className="container mx-auto bg-gray-900 py-10">
      <h1 className="text-4xl font-bold mb-8 text-white text-center tracking-wider">
        Community Shared Articles
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {renderedPosts}
      </div>
    </section>
  );
};
