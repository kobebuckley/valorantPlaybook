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
  const [videoUrl, setVideoUrl] = useState(post?.videoUrl || ''); // Initialize with an empty string

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
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <label htmlFor="videoUrlContent">Video:</label>
        <input
          type="text"
          id="videoUrlContent"
          name="videoUrlContent"
          value={videoUrl}
          onChange={onVideoUrlChanged}
        />
      </form>
      <button type="button" onClick={onSavePostClicked}>
        Save Post
      </button>
      <Link to={`/posts/${postId}`}>Cancel</Link>
    </section>
  );
};

export default EditPostForm;
