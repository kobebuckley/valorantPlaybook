import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { registerUserWithEmailAndPassword, signInUser } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';

const defaultFormFields = {
  displayName: '',
  email: '',
  password: '',
};

function NewRegister() {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password } = formFields;
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const resetFormFields = () => {
    return setFormFields(defaultFormFields);
  };

  useEffect(() => {
    if (successMessage || registerError) {
      const timeout = setTimeout(() => {
        setSuccessMessage('');
        setRegisterError('');
        navigate('/'); // Navigate to '/' after showing messages
      }, 3000); // Hide messages after 3 seconds
      return () => clearTimeout(timeout);
    }
  }, [successMessage, registerError, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const registeredUser = await registerUserWithEmailAndPassword(displayName, email, password);

      if (registeredUser) {
        const signedInUser = await signInUser(email, password);

        if (signedInUser) {
          const user = signedInUser;
          await updateProfile(user, {
            displayName: displayName,
          });

          resetFormFields();
          setSuccessMessage('Registration successful! Logging in...');
        }
      }
    } catch (error: any) {
      console.log('User Registration Failed', error.message);
      setRegisterError('Registration failed. Please check your details.');
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
        {registerError && (
          <p className="text-red-500 mb-2 text-center">{registerError}</p>
        )}
        {successMessage && (
          <p className="text-green-500 mb-2 text-center">{successMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="displayName"
              value={displayName}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="Display Name"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="Password"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewRegister;
