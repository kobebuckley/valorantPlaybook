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

  return (
    <nav className="bg-indigo-600 py-4 text-white sticky top-0 z-50">
      <section className="container mx-auto flex justify-between items-center">
        <div>
          <Link
            to="/"
            className={`text-3xl font-bold tracking-tight transition-colors duration-300 hover:text-yellow-400`}
          >
            {title}
          </Link>
        </div>

        <div>
          {user ? (
            <div>
              <span className="text-white mr-4">Hello, {user.displayName}!</span>
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-white hover:text-gray-300 font-bold text-xl">
              Login
            </Link>
          )}
        </div>

        <div className="navContent ml-4 flex items-center space-x-4">
          {!user && (
            <div>
              <Link
                to="/register"
                className={`text-xl font-bold tracking-tight transition-colors duration-300 hover:text-yellow-400`}
              >
                Register
              </Link>
            </div>
          )}

          <div>
            <Link
              to="/addPost"
              className={`text-xl font-bold tracking-tight transition-colors duration-300 hover:text-yellow-400`}
            >
              Add Post
            </Link>
          </div>
        </div>
      </section>
    </nav>
  );
};
