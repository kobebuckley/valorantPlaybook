
import { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { SignOutUser, userStateListener } from "../firebase/firebase";
import { createContext, useState, useEffect, ReactNode } from "react";

interface Props {
  children?: ReactNode
}

export const AuthContext = createContext({
  // "User" comes from firebase auth-public.d.ts
  currentUser: {} as User | null,
  setCurrentUser: (_user:User) => {},
  signOut: () => {}
});

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = userStateListener((user) => {
      if (user) {
        setCurrentUser(user)
      }
    });
    return unsubscribe
  }, [setCurrentUser]);

  // As soon as setting the current user to null, 
  // the user will be redirected to the home page. 
  const signOut = async () => {
    try {
      await SignOutUser(); // Wait for sign-out to complete
      setCurrentUser(null); // Clear the user after successful sign-out
      navigate('/'); // Redirect after sign-out
    } catch (error) {
      console.error('Error signing out:', error);
      // You can display an error message to the user here
    }
  };
  
  
  const value = {
    currentUser, 
    setCurrentUser,
    signOut
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
