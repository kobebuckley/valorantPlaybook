import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AgentsList } from './features/agents/AgentsList';
import { AddPostForm } from './features/posts/AddPostForm';
import SinglePostPage from './features/posts/SinglePostPage';
import { EditPostForm } from './features/posts/EditPostForm';
import { Navbar } from './app/Navbar';
import { AgentPostsPage } from './features/posts/AgentPostsPage';

import './App.css';
import LoginPage from './features/login';

function App() {
  return (
    <Router>
      <Navbar title={'Agents'} />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:agent/:postId" element={<SinglePostPage />} />
          <Route path="/editPost/:agent/:postId" element={<EditPostForm  />} />
          <Route path="/agents/:agent" element={<AgentPostsPage />} />
          {/* <Route path="/agents/" element={<PostsList posts={[]} />} /> */}
          <Route path="/addPost" element={<AddPostForm />} /> 

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <React.Fragment>
      {/* Render the AgentsList component */}
      
      <LoginPage onLogin={() => {}} />
      <AgentsList onSelectAgent={function (selectedAgent: string): void {
        throw new Error('Function not implemented.');
      } } />
    </React.Fragment>
  );
}

function NotFound() {
  return <h1>Page not found</h1>;
}

export default App;