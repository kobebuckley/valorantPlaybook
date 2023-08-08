import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AgentsList } from '../features/agents/AgentsList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { selectLoggedInUser, setLoggedInUser } from '../features/users/usersSlice';
import { useDispatch, useSelector } from 'react-redux';
// import { User, authenticateUser, setLoggedInUser } from './usersSlice';

interface NavbarProps {
  title: string;
}


interface NavbarProps {
  title: string;
}


export const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const loggedInUser = useSelector(selectLoggedInUser);
  const dispatch = useDispatch(); // Use the useDispatch hook here
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [isArrowHovered, setIsArrowHovered] = useState<boolean>(false);
  // const [showErrorModal, setShowErrorModal] = useState<boolean>(false); 

const handleSignOut = () => {
    try {
      dispatch(setLoggedInUser(null));
      localStorage.removeItem('loggedInUser');
      
      // setTimeout(() => {
      //   navigate('/login'); // Redirect to the login page
      // }, 3000); // Adjust the delay as needed
    } catch (error) {
      console.error('Error while signing out:', error);
    }
  };

  const handleAgentSelect = (selectedAgent: string) => {
    setSelectedAgent(selectedAgent);
  };
  const navigateToHome = () => {
    navigate('/');
  };

  const handleArrowHover = (hovered: boolean) => {
    setIsArrowHovered(hovered);
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
          {loggedInUser ? (
            <div>
              <span className="text-white mr-4">Hello, {loggedInUser.name}!</span>
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300"
              >
                <Link to="/" className="text-white hover:text-gray-300 font-bold text-xl">
                  Sign Out
                </Link>
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-white hover:text-gray-300 font-bold text-xl">
              Login
            </Link>
          )}
        </div>

        <div className="navContent ml-4 flex items-center space-x-4">
          {!loggedInUser && (
            <div>
              <Link
                to="/register"
                className={`text-xl font-bold tracking-tight transition-colors duration-300 hover:text-yellow-400`}
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <div className="navContent ml-4 flex items-center space-x-4">
          <div>
            <Link
              to="/addPost"
              className={`text-xl font-bold tracking-tight transition-colors duration-300 hover:text-yellow-400`}
            >
              Add Post
            </Link>
          </div>

          <div className="relative inline-block">
            <select
              value={selectedAgent}
              onChange={(e) => handleAgentSelect(e.target.value)}
              className="block appearance-none bg-indigo-600 border border-indigo-200 text-white py-2 px-4 pr-8 rounded text-xl font-bold tracking-tight focus:outline-none focus:bg-indigo-700 focus:border-indigo-300"
            >
              <option value="">Select an agent</option>
              <option value="gekko">Gekko</option>
              <option value="fade">Fade</option>
            </select>
            {selectedAgent && (
              <Link to={`/agents/${selectedAgent}`} className="absolute right-0 top-0 mt-2 mr-3">
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className={`text-${isArrowHovered ? 'yellow-400' : 'white'} transition-colors duration-300`}
                  onMouseEnter={() => handleArrowHover(true)}
                  onMouseLeave={() => handleArrowHover(false)}
                />
              </Link>
            )}
            {loggedInUser && loggedInUser.isAdmin && (
  <Link to="review">
    <button className="bg-indigo-700 text-white px-3 py-1 rounded hover:bg-indigo-900 focus:outline-none focus:ring focus:ring-indigo-300">
      Review
    </button>
  </Link>)}
          </div>
        </div>
      </section>
    </nav>
  );
};