import React from 'react';
import { useSelector } from 'react-redux';
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
        <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
        <div className="prose max-w-full mb-6" dangerouslySetInnerHTML={{ __html: post.content }}></div>

        {/* Center the video */}
        {videoId && (
          <div className="flex justify-center mb-6">
            <YouTube videoId={videoId} />
          </div>
        )}

        {/* Area 1 */}
        <section className="mb-6">
          <h3 className="text-2xl font-bold mb-2">Area 1: The Beginning</h3>
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
          </p>
          {/* Include additional content for Area 1 */}
        </section>

        {/* Area 2 */}
        <section className="mb-6">
          <h3 className="text-2xl font-bold mb-2">Area 2: The Middle</h3>
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
          </p>
          {/* Include additional content for Area 2 */}
        </section>

        {/* Area 3 */}
        <section className="mb-6">
          <h3 className="text-2xl font-bold mb-2">Area 3: The Climax</h3>
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
          </p>
          {/* Include additional content for Area 3 */}
        </section>

        {/* Conclusion */}
        <section className="mb-6">
          <h3 className="text-2xl font-bold mb-2">Conclusion</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
          </p>
          {/* Include final thoughts or summary here */}
        </section>
      </article>
    );
  });

  return (
    <section className="posts-list">
      <h1 className="text-4xl font-bold mb-8">Large Gaming Article: In-Depth Game Analysis</h1>
      {renderedPosts}
    </section>
  );
};
