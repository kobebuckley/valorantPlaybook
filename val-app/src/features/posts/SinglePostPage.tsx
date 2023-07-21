import React from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';

interface Post {
  id: string;
  title: string;
  content: string;
  youtubeUrl?: string;
}

const SinglePostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const posts: Post[] = useSelector((state: { posts: Post[] }) => state.posts);

  const extractVideoId = (url: string): string => {
    const videoIdRegex = /(?:youtu.be\/|youtube(?:-nocookie)?.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
    const match = url.match(videoIdRegex);
    return match ? match[1] : '';
  };

  const renderVideoEmbed = (url: string | undefined): JSX.Element | null => {
    if (!url) {
      return null; // If youtubeUrl is not available, return null or render a message
    }

    const videoId = extractVideoId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    return (
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          title="YouTube Video"
          src={embedUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  };

  const post: Post | undefined = posts.find((post) => post.id === postId);

  if (!post) {
    return <h1>Post not found</h1>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded p-6 mb-4">
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      {renderVideoEmbed(post.youtubeUrl)}
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





// import React from 'react';
// import { useSelector } from 'react-redux';
// import { useParams, Link } from 'react-router-dom';
// import YouTube from 'react-youtube';

// interface Post {
//   id: string;
//   title: string;
//   content: string;
//   videoUrl: string;
// }

// export const SinglePostPage: React.FC = () => {
//   const posts: Post[] = useSelector((state: { posts: Post[] }) => state.posts);

//   const extractVideoId = (url: string): string | undefined => {
//     const match = url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
//     return match?.[1];
//   };

//   const renderedPosts = posts.map((post: Post) => {
//     const videoId = extractVideoId(post.videoUrl);

//     return (
//       <article className="post-excerpt p-6 bg-gray-900 text-white rounded shadow-lg" key={post.id}>
//         {/* Center the video */}
//         <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
//         {videoId && (
//           <div className="flex justify-center mb-6">
//             <YouTube videoId={videoId} />
//           </div>
//         )}
//       <p className="post-content">{post.content.substring(0, 100)}</p>
//         <Link to={`/posts/${post.id}`} className="button muted-button">
//         View Post
//       </Link>



//       </article>
//     );
//   });

//   return (
//     <section className="posts-list">
//       <h1 className="text-4xl font-bold mb-8">Comunity Shared Articles</h1>
//       {renderedPosts}
//     </section>
//   );
// };
// export default SinglePostPage;
