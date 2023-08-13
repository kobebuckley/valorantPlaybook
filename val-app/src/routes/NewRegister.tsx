import React, { ChangeEvent, FormEvent, useState } from 'react';
import { registerUserWithEmailAndPassword } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import '.././App.css';

const defaultFormFields = {
  email: '',
  password: '',
};

function NewRegister() {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;
  const navigate = useNavigate();

  const resetFormFields = () => {
    return setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const registeredUser = await registerUserWithEmailAndPassword(email, password);
      console.log('New user registered:', registeredUser);

      if (registeredUser) {
        resetFormFields();
        navigate('/profile');
      }
    } catch (error: any) { // Explicitly type the 'error' variable
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
