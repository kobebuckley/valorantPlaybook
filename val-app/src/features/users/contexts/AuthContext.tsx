import React, { useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '../../../firebase';  
import firebase from 'firebase/app'; 

interface AuthContextValue {
    currentUser: firebase.User | null;
    signup: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);

    function signup(email: string, password: string) {
        return auth.createUserWithEmailAndPassword(email, password);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user: React.SetStateAction<firebase.User | null>) => {
            setCurrentUser(user);
        });

        return unsubscribe;
    }, []);

    const value: AuthContextValue = {
        currentUser,
        signup
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
