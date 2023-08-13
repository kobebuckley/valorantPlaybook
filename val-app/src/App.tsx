import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { AgentsList } from './features/agents/AgentsList';
import { AddPostForm } from './features/posts/AddPostForm';
import SinglePostPage from './features/posts/SinglePostPage';
import { EditPostForm } from './features/posts/EditPostForm';
import { Navbar } from './app/Navbar';
import { AgentPostsPage } from './features/posts/AgentPostsPage';

import './App.css';
import LoginPage from './features/users/login';
import RegisterPage from './features/users/register';
import SignoutPage from './features/users/signOut';
import NonModeratedPostsPage from './features/posts/NonModeratedPostsPage';





import Profile from './routes/profile'
import { AuthContext } from './context/auth-context';
import RequireAuth from './components/require-auth';
import NewLogin from './routes/NewLogin';
import NewRegister from './routes/NewRegister';




function App() {
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()

  console.log('User:', !!currentUser);

  useEffect(() => {
    if (currentUser) {
      navigate('/profile')
    }
  }, [currentUser])


  return (
    <div>
      <Navbar title={'The Valorant Playbook'} />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<NewLogin />} />
          <Route path="/register" element={<NewRegister />} />
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
//   return (
 
//       {/* <Route index element={<NewRegister />} /> */}
//       {/* <Route index element={<NewLogin />} /> */}
//       <Route path="/" element={<Home />} />
//       <Route path="/login" element={<NewLogin />} />
//       <Route path="/register" element={<NewRegister />} />
//       <Route path="profile" element={
//         <RequireAuth>
//           <Profile />
//         </RequireAuth>}
//       />
//     </Routes>
//         </Router>
//             </div>

//   )
// }



//   return (
//     <Router>
//       <Navbar title={'The Valorant Playbook'} />
//       <div className="App">
//         <Routes>
//         {/* <Route path="/login" element={<LoginPage onLogin={()=>{}} />} /> */}
//         {/* <Route path="/register" element={<RegisterPage onRegister={()=>{}} />} /> */}
//           <Route path="/" element={<Home />} />
//           <Route path="/posts/:agent/:postId" element={<SinglePostPage />} />
//           <Route path="/editPost/:agent/:postId" element={<EditPostForm  />} />
//           <Route path="/agents/:agent" element={<AgentPostsPage />} />
//           <Route path="/addPost" element={<AddPostForm />} /> 
//           <Route path="/review" element={<NonModeratedPostsPage/>} />
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// function Home() {
//   return (
//     <React.Fragment>
//       <AgentsList onSelectAgent={function (selectedAgent: string): void {
//         throw new Error('Function not implemented.');
//       } } />
//     </React.Fragment>
//   );
// }

// function NotFound() {
//   return <h1>Page not found</h1>;
// }

// export default App;