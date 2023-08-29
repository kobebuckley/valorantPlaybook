import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDispatch } from 'react-redux';
import { auth } from '../firebase/firebase';
import { setLoggedInUser } from '../features/users/usersSlice';

interface NavbarProps {
  title: string;
}

export const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const [user] = useAuthState(auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      dispatch(setLoggedInUser(null));
      navigate('/login');
    } catch (error) {
      console.error('Error while signing out:', error);
    }
  };


  // const NavigationBar = ({ title, user, handleSignOut }) => {
    const [menuOpen, setMenuOpen] = useState(false);
  
    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };

    
  return (
    <nav className="bg-indigo-700 py-4 text-white sticky top-0 z-50 font-bold">
      {/* Desktop Version */}
      <section className="container mx-auto hidden sm:block">
        <div className="flex justify-between items-center">
          <div>
            <Link
              to="/"
              className={`text-4xl font-bold tracking-tight transition-colors duration-300 hover:text-yellow-400`}
            >
              {title}
            </Link>
            
          </div>
          <div className="navContent flex space-x-4">
            {!user && (
              <Link
                to="/login" 
                className="py-1 text-2xl font-bold tracking-tight transition-colors duration-300 hover:text-yellow-400"
              >
                Login
              </Link>
            )}

          <div className="navContent flex space-x-4">
            {!user && (
              <Link
                to="/register"
                className="text-2xl py-1 font-bold tracking-tight transition-colors duration-300 hover:text-yellow-400"
              >
                Register
              </Link>
            )}
          <div className="navContent flex space-x-4">
         
            <Link
              to="/addPost"
              className="text-2xl py-1 mr-10 font-bold tracking-tight transition-colors duration-300 hover:text-yellow-400"
            >
              Add Post
            </Link>
          

          </div>

            {user && (
              <div className="text-white text-2xl">
                Hello, {user.displayName}!
                <button
                  onClick={handleSignOut}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 ml-4"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
        </div>
      </section>

     {/* Mobile Version */} 
     <div className="container mx-auto sm:hidden flex justify-between items-center ">
        <Link
          to="/"
          className={`text-2xl font-bold tracking-tight transition-colors duration-300 hover:text-yellow-400 ml-20`}
        >
          {title}
        </Link>
        <button
          onClick={toggleMenu}
          className="text-white text-2xl p-2 focus:outline-none"
        >
          <svg
            className={`w-6 h-6 ${menuOpen ? 'hidden' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
          <svg
            className={` w-6 h-6 ${menuOpen ? '' : 'hidden'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
      {menuOpen && (
  <div className="mx-auto sm:hidden mt-4 pt-4 text-right absolute right-0 top-20px bg-indigo-700 ml-4 z-10">
  {user ? (
      <div>

      <span className=" m-1 p-8 mr-4 text-xl mx-auto whitespace-normal ">Hello</span>
      <div className="ml-1 m-2 mx-auto whitespace-normal text-xl">{user.displayName}!</div> 


    <div className="text-white text-lg bg-red-700">
    
              <button
                onClick={handleSignOut}
                className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 my-1 mr-2 p-2"
              >
                Sign Out
              </button>
            </div>
            </div>
          ) : (
            <div className="text-white">
              <Link
                to="/login"
                className="hover:text-yellow-400 font-boldblock my-1 mr-9 py-3 text-xl"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="font-bold tracking-tight transition-colors duration-300 hover:text-yellow-400 block my-1 mr-7 py-3 text-xl"
              >
                Register
              </Link>
            </div>
          )}
          <Link
            to="/addPost"
            className="font-bold tracking-tight transition-colors duration-300 hover:text-yellow-400 block my-2 mr-4 p-2 text-xl "
          >
            Add Post
          </Link>
        </div>
      )}
    </nav>
  );
};