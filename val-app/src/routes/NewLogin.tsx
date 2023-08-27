import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { signInUser } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';

const defaultFormFields = {
  email: '',
  password: '',
};

function NewLogin() {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => {
        setSuccessMessage('');
        navigate('/'); 
      }, 1000); 
      return () => clearTimeout(timeout);
    }
  }, [successMessage, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const userCredential = await signInUser(email, password);

      if (userCredential) {
        resetFormFields();
        setLoginError('');
        setSuccessMessage('Success!');
      }
    } catch (error: any) {
      setLoginError('Authentication failed. Please check your credentials.');
      setSuccessMessage('');
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className="bg-gray-800 min-h-screen flex items-center justify-center">
      <div className="bg-gray-200 p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        {loginError && (
          <p className="text-red-500 mb-2 text-center">{loginError}</p>
        )}
        {successMessage && (
          <p className="text-green-500 mb-2 text-center">{successMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-1">
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-medium mb-1">
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewLogin;
