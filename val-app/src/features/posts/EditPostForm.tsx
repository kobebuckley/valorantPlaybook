import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../app/store';
import { Post, postUpdated, selectPostById } from './postsSlice';

interface User {
  id: string;
  name: string;
  username: string;
  hashedPassword: string;
  isAdmin: boolean;
}
interface EditPostFormProps {
  loggedInUser: User | null;
}



export const EditPostForm: React.FC<EditPostFormProps> = ({ loggedInUser }) => {
  const { agent, postId } = useParams<{ agent: string; postId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const post: Post | undefined = useSelector((state: RootState) =>
    postId ? selectPostById(state, postId) : undefined
  );

  // const post = posts.find((post) => post.id === postId && post.agent === agent);

  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [videoUrl, setVideoUrl] = useState(post?.videoUrl || '');
  const [selectedAgent, setSelectedAgent] = useState(post?.agent || '');

  useEffect(() => {
    setTitle(post?.title || '');
    setContent(post?.content || '');
    setVideoUrl(post?.videoUrl || '');
    setSelectedAgent(post?.agent || '');
  }, [post]);

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);
  const onVideoUrlChanged = (e: React.ChangeEvent<HTMLInputElement>) => setVideoUrl(e.target.value);
  const onAgentChanged = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedAgent(e.target.value);

  const onSavePostClicked = () => {
    if (title && content && videoUrl && selectedAgent) {
      const updatedPost: Post = {
        id: postId!,
        date: new Date().toISOString(),
        title,
        content,
        videoUrl,
        agent: selectedAgent,
        userId: '',
        reactions: {},
      };

      dispatch(postUpdated(updatedPost));
      navigate(`/posts/${selectedAgent}/${postId}`);
    }
  };

  if (!post) {
    return <h2>Loading...</h2>;
  }
  console.log('loggedInUser:', loggedInUser);
  console.log('post:', post);

  const isAuthor = loggedInUser && loggedInUser.id === post.userId;
  console.log('Is author:', isAuthor);

  return (
    <section className="bg-gray-900 min-h-screen py-10">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-white">Edit Post</h2>
        {isAuthor ? ( // Render the form if the user is the author
          <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="agentSelect" className="text-lg text-white">
              Agent:
            </label>
            <select
              id="agentSelect"
              name="agentSelect"
              value={selectedAgent}
              onChange={onAgentChanged}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="gekko">Gekko</option>
              <option value="fade">Fade</option>
            </select>
          </div>
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
              disabled={loggedInUser.id !== post.userId && !loggedInUser.isAdmin}
            >
              Save Post
            </button>
            <Link to={`/posts/${selectedAgent}/${postId}`} className="px-4 py-2 ml-2 text-blue-500 hover:text-blue-700">
              Cancel
            </Link>
          </div>
        </form>
              ) : (
                <p>You don't have permission to edit this post.</p>
              )}
            </div>
          </section>
        );
      };
      
export default EditPostForm;