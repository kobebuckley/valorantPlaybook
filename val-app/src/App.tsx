import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Updated import
import { AgentsList } from './features/agents/AgentsList';
import { AddPostForm } from './features/posts/AddPostForm';
import SinglePostPage from './features/posts/SinglePostPage';
import { EditPostForm } from './features/posts/EditPostForm';
import { Navbar } from './app/Navbar';
import { AgentPostsPage } from './features/posts/AgentPostsPage';

import './App.css';

function App() {
  return (
    <Router>
      <Navbar title={'THE NAV IS HERE'} />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:agent/:postId" element={<SinglePostPage />} />
          <Route path="/editPost/:agent/:postId" element={<EditPostForm />} />
          <Route path="/agents/:agent" element={<AgentPostsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  // Function to handle agent selection and navigate to the AgentPostsPage
  const handleAgentSelect = (selectedAgent: string) => {
    // Use the imported 'navigate' function directly to navigate to the AgentPostsPage with the selected agent
    return <Navigate to={`/agents/${selectedAgent}`} />;
  };

  return (
    <React.Fragment>
      {/* Pass the handleAgentSelect function as a prop to AgentsList */}
      <AgentsList onSelectAgent={handleAgentSelect} />
    </React.Fragment>
  );
}

function NotFound() {
  return <h1>Page not found</h1>;
}

export default App;
