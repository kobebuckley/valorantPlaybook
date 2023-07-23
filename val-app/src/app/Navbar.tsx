import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AgentsList } from '../features/agents/AgentsList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface NavbarProps {
  title: string;
}

export const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [isArrowHovered, setIsArrowHovered] = useState<boolean>(false);
  const navigate = useNavigate();

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
            onClick={navigateToHome}
          >
            {title}
          </Link>
        </div>

        <div className="navContent ml-4 flex items-center space-x-4">
          <div>
            <Link
              to="/addPost"
              className={`text-xl tracking-tight transition-colors duration-300 hover:text-yellow-400`}
            >
              Add Post
            </Link>
          </div>

          <div className="relative inline-block">
            <select
              value={selectedAgent}
              onChange={(e) => handleAgentSelect(e.target.value)}
              className="block appearance-none bg-indigo-600 border border-indigo-200 text-white py-2 px-4 pr-8 rounded text-xl tracking-tight focus:outline-none focus:bg-indigo-700 focus:border-indigo-300"
            >
              <option value="">Select an agent</option>
              <option value="gekko">Gekko</option>
              <option value="fade">Fade</option>
              {/* Rest of the agent options here */}
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
          </div>
        </div>
      </section>
    </nav>
  );
};
