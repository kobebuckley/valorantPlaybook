import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../app/store';
import { postUpdated } from './postsSlice';

interface Post {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
  agent: string;
}

export const EditPostForm: React.FC = () => {
  const { agent, postId } = useParams<{ agent: string; postId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Retrieve the posts array from the Redux store
  const posts = useSelector((state: RootState) => state.posts);

  // Find the post with matching postId and agent in the posts array
  const post = posts.find((post) => post.id === postId && post.agent === agent);

  // State for form fields
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [videoUrl, setVideoUrl] = useState(post?.videoUrl || '');

  useEffect(() => {
    // Update the form fields when the post changes
    setTitle(post?.title || '');
    setContent(post?.content || '');
    setVideoUrl(post?.videoUrl || '');
  }, [post]);

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);
  const onVideoUrlChanged = (e: React.ChangeEvent<HTMLInputElement>) => setVideoUrl(e.target.value);

  const onSavePostClicked = () => {
    if (title && content && videoUrl && agent) {
      const updatedPost: Post = {
        id: postId!,
        title,
        content,
        videoUrl,
        agent,
      };

      dispatch(postUpdated(updatedPost));
      navigate(`/posts/${agent}/${postId}`);
    }
  };

  if (!post) {
    return <h2>Loading...</h2>;
  }

  return (
    <section className="bg-gray-900 min-h-screen py-10">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-white">Edit Post</h2>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="postTitle" className="text-lg text-white">
              Post Title:
            </label>
            <input
              type="text"
              id="postTitle"
              name="postTitle"
              placeholder="What's on your mind?"
              value={title}
              onChange={onTitleChanged}
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="postContent" className="text-lg text-white">
              Content:
            </label>
            <textarea
              id="postContent"
              name="postContent"
              value={content}
              onChange={onContentChanged}
              className="border border-gray-300 rounded-md p-2"
              rows={6}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="videoUrlContent" className="text-lg text-white">
              Video:
            </label>
            <input
              type="text"
              id="videoUrlContent"
              name="videoUrlContent"
              value={videoUrl}
              onChange={onVideoUrlChanged}
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={onSavePostClicked}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save Post
            </button>
            <Link to={`/posts/${agent}/${postId}`} className="px-4 py-2 ml-2 text-blue-500 hover:text-blue-700">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditPostForm;
