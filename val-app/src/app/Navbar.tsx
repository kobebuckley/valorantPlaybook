import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  title: string;
}

export const Navbar: React.FC<NavbarProps> = ({ title }) => {
  return (
    <nav className="bg-blue-500 py-4 text-white">
      <section className="container mx-auto flex justify-center items-center">
        <h1 className="text-4xl font-bold">{title}</h1>

        <div className="navContent">
          <div className="navLinks">
          <Link to="/">Posts</Link>
          </div>
        </div>
      </section>
    </nav>
  );
};
