import React from 'react';
import { Link } from 'react-router-dom';

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Not Logged In</h2>
        <p className="mb-4 text-gray-600">{message}</p>
        <div className="flex flex-col space-y-2 items-center">
          <Link
            to="/register"
            className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 focus:outline-none text-center w-full"
            onClick={onClose}
          >
            Register
          </Link>
          <Link
            to="/login"
            className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 focus:outline-none text-center w-full"
            onClick={onClose}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
