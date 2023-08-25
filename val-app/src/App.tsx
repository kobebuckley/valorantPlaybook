import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes,  } from 'react-router-dom';
import { AgentsList } from './features/agents/AgentsList';
import AddPostForm from "./features/posts/AddPostForm";
import { Navbar } from './app/Navbar';
import { AuthContext } from './context/auth-context';
import NewLogin from './routes/NewLogin';
import NewRegister from './routes/NewRegister';
import AgentPostsPage from './features/posts/AgentPostsPage';
import SinglePostPage from './features/posts/SinglePostPage';

import './App.css'
import EditPostForm from './features/posts/EditPostForm';

function App() {
  const { currentUser } = useContext(AuthContext); // Use the AuthContext
  const isAuth = currentUser !== null;
  // const navigate = useNavigate();

  console.log('User:', !!currentUser);

  // useEffect(() => {
  //   if (currentUser) {
  //     navigate('/profile');
  //   }
  // }, [currentUser]);

  return (
    <div>
      <Navbar title={'The Valorant Playbook'} />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<NewLogin />} />
          <Route path="/register" element={<NewRegister />} />
          <Route path="/addPost" element={<AddPostForm isAuth={isAuth} />} />
          <Route path="/agents/:agent" element={<AgentPostsPage />} />
          <Route path="/posts/:agent/:id" element={<SinglePostPage />} />
          <Route path="/editPost/:agent/:id" element={<EditPostForm   />} />

        </Routes>
      </div>
    </div>
  );
}

function Home() {
  return (
    <React.Fragment>
      <AgentsList onSelectAgent={function (selectedAgent: string): void {
        throw new Error('Function not implemented.');
      }} />
    </React.Fragment>
  );
}

export default App;
