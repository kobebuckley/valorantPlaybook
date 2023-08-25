import React from 'react';
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
                className="text-2xl font-bold tracking-tight transition-colors duration-300 hover:text-yellow-400"
              >
                Login
              </Link>
            )}

          <div className="navContent flex space-x-4">
            {!user && (
              <Link
                to="/register"
                className="text-2xl font-bold tracking-tight transition-colors duration-300 hover:text-yellow-400"
              >
                Register
              </Link>
            )}

            <Link
              to="/addPost"
              className="text-2xl font-bold tracking-tight transition-colors duration-300 hover:text-yellow-400"
            >
              Add Post
            </Link>

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
      <div className="container mx-auto sm:hidden text-center">
        <div className="mb-4">
          <Link
            to="/"
            className={`text-4xl font-bold tracking-tight transition-colors duration-300 hover:text-yellow-400`}
          >
            {title}
          </Link>
        </div>

        {user ? (
          <div className="mb-2">
            <span className="text-white text-2xl mb-2">Hello, {user.displayName}!</span>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 text-lg"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="mb-2">
            <Link
              to="/login"
              className="hover:text-yellow-400 font-bold mb-2 block mx-auto text-white text-3xl"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-2xl font-bold tracking-tight transition-colors duration-300 hover:text-yellow-400 block mx-auto"
            >
              Register
            </Link>
          </div>
        )}

        <Link
          to="/addPost"
          className="text-2xl font-bold tracking-tight transition-colors duration-300 hover:text-yellow-400 block mx-auto mt-4"
        >
          Add Post
        </Link>
      </div>
    </nav>
  );
};
