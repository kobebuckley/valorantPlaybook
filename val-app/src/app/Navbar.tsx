import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
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

  console.log("display name is:" + user?.displayName)

  return (
    <nav className="bg-indigo-700 py-4 text-white sticky top-0 z-50">
      <section className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-4 sm:mb-0">
          <Link
            to="/"
            className={`text-4xl font-bold tracking-tight transition-colors duration-300 hover:text-yellow-400`}
          >
            {title}
          </Link>
        </div>

        <div className="mb-4 sm:mb-0">
          {user ? (
            <div className="mb-2 sm:mb-0">
              <span className="text-white mr-2 text-lg">Hello, {user.displayName}!</span>
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 text-lg"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-white hover:text-gray-300 font-bold text-lg"
            >
              Login
            </Link>
          )}
        </div>

        <div className="navContent mb-4 sm:mb-0 flex items-center space-x-2 sm:space-x-4">
          {!user && (
            <Link
              to="/register"
              className="text-lg font-bold tracking-tight transition-colors duration-300 hover:text-yellow-400"
            >
              Register
            </Link>
          )}

          <Link
            to="/addPost"
            className="text-lg font-bold tracking-tight transition-colors duration-300 hover:text-yellow-400"
          >
            Add Post
          </Link>
        </div>
      </section>
    </nav>
  );
};