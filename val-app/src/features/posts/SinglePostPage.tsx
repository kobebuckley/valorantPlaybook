import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

interface Post {
  id: string;
  title: string;
  content: string;
}

interface MatchParams {
  postId: string;
}

interface SinglePostPageProps {
  match?: {
    params?: MatchParams;
  };
}

export const SinglePostPage: React.FC<SinglePostPageProps> = ({ match }) => {
  if (!match || !match.params) {
    // Handle the case where the 'match' prop or 'match.params' is undefined
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  const { postId } = match.params;

  const post = useSelector((state: RootState) =>
    state.posts.find((post: Post) => post.id === postId)
  );

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <p className="post-content">{post.content}</p>
      </article>
    </section>
  );
};

export default SinglePostPage;
