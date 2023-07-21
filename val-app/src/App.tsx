import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, RouteProps } from "react-router-dom";
import { AgentsList } from "./features/agents/AgentsList";
import { AddPostForm } from "./features/posts/AddPostForm";
import SinglePostPage from "./features/posts/SinglePostPage"; // Update this import
import { PostsList } from "./features/posts/PostsList";
import { EditPostForm } from './features/posts/EditPostForm'
import { Navbar } from "./app/Navbar";

import "./App.css";

function App() {
  return (
    <Router>
      <Navbar title={"THE NAV IS HERE"} />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:postId" element={<SinglePostPage />} /> {/* Update the import here */}
          <Route path="/editPost/:postId" element={<EditPostForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <React.Fragment>
      <AddPostForm />
      <PostsList />
      <AgentsList />
    </React.Fragment>
  );
}

function NotFound() {
  return <h1>Page not found</h1>;
}

export default App;
