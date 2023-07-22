import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { RootState } from '../../app/store';
import { postUpdated } from './postsSlice';

export const EditPostForm: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const post = useSelector((state: RootState) =>
    state.posts.find((post) => post.id === postId)
  );

  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [videoUrl, setVideoUrl] = useState(post?.videoUrl || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);
  const onVideoUrlChanged = (e: React.ChangeEvent<HTMLInputElement>) => setVideoUrl(e.target.value);

  const onSavePostClicked = () => {
    if (title && content) {
      dispatch(
        postUpdated({ id: postId!, title, content, videoUrl: videoUrl || '' }) 
      );
      navigate(`/posts/${postId}`);
    }
  };

  if (!post) {
    return <h2>Loading...</h2>;
  }

  return (
    <section>
      <h2 className="text-3xl font-bold mb-4">Edit Post</h2>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="postTitle" className="text-lg">Post Title:</label>
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
          <label htmlFor="postContent" className="text-lg">Content:</label>
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
          <label htmlFor="videoUrlContent" className="text-lg">Video:</label>
          <input
            type="text"
            id="videoUrlContent"
            name="videoUrlContent"
            value={videoUrl}
            onChange={onVideoUrlChanged}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
      </form>
      <div className="mt-4">
        <button
          type="button"
          onClick={onSavePostClicked}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Save Post
        </button>
        <Link
          to={`/posts/${postId}`}
          className="px-4 py-2 ml-2 text-blue-500 hover:text-blue-700"
        >
          Cancel
        </Link>
      </div>
    </section>
  );
};

export default EditPostForm;
