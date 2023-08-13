import React, { ChangeEvent, FormEvent, useState } from 'react';
import { registerUserWithEmailAndPassword, signInUser } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import '.././App.css';
import { UserCredential, updateProfile } from 'firebase/auth'; // Make sure to import the correct types

const defaultFormFields = {
  displayName: '',
  email: '',
  password: '',
};

function NewRegister() {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password } = formFields;
  const navigate = useNavigate();

  const resetFormFields = () => {
    return setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    try {
        const registeredUser = await registerUserWithEmailAndPassword(displayName, email, password);
  
      if (registeredUser) {
        const signedInUser = await signInUser(email, password);
  
        if (signedInUser) {
          // Update the display name using updateProfile
          const user = signedInUser; // Use the user from signedInUser
          await updateProfile(user, {
            displayName: displayName,
          });
  
          resetFormFields();
          navigate('/profile');
        }
      }
    } catch (error: any) {
      console.log('User Registration Failed', error.message);
    }
  };
  

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className="App">
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="displayName"
              value={displayName}
              onChange={handleChange}
              placeholder="Display Name"
              required
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          <div>
            <input id='recaptcha' type="submit" value="Register" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewRegister;
