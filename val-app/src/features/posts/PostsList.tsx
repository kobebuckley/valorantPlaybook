import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import YouTube from 'react-youtube';

interface Post {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
}

export const PostsList: React.FC = () => {
  const posts: Post[] = useSelector((state: { posts: Post[] }) => state.posts);

  const extractVideoId = (url: string): string | undefined => {
    const match = url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match?.[1];
  };

  const renderedPosts = posts.map((post: Post) => {
    const videoId = extractVideoId(post.videoUrl);

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
        <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>


        {/* Area 1 */}
        {/* <section className="mb-6">
          <h3 className="text-2xl font-bold mb-2">Excerpt</h3>
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
          </p>
        </section> */}

        {/* <section className="mb-6">
          <h3 className="text-2xl font-bold mb-2">Area 2: The Middle</h3>
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-2xl font-bold mb-2">Area 3: The Climax</h3>
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-2xl font-bold mb-2">Conclusion</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
          </p>
          
        </section> */}

      </article>
    );
  });

  return (
    <section className="posts-list">
      <h1 className="text-4xl font-bold mb-8">Comunity Shared Articles</h1>
      {renderedPosts}
    </section>
  );
};
