import React from 'react';
import { useDispatch } from 'react-redux';
import { setLoggedInUser } from './usersSlice';

interface ResetUserProps {
  onResetUser: () => void;
}

function ResetUser({ onResetUser }: ResetUserProps) {
  const dispatch = useDispatch();

  const handleResetUser = () => {
    dispatch(setLoggedInUser(null));
    localStorage.removeItem('loggedInUser');
    onResetUser();
  };

  return (
    <div>
      <p>Are you sure you want to reset the logged-in user state?</p>
      <button onClick={handleResetUser}>Reset User</button>
    </div>
  );
}

export default ResetUser;
