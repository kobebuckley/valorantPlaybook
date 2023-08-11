import React, { useRef, useState } from 'react';
import { useAuth } from './contexts/AuthContext';

export default function Signup() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmRef = useRef<HTMLInputElement>(null);
    const { signup } = useAuth();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (
            emailRef.current &&
            passwordRef.current &&
            passwordConfirmRef.current &&
            passwordRef.current.value === passwordConfirmRef.current.value
        ) {
            try {
                await signup(emailRef.current.value, passwordRef.current.value);
                // Handle successful registration, redirect, or show a message
            } catch (error) {
                // Handle registration error, e.g., show an error message
            }
        } else {
            // Handle password mismatch error
        }
    }

    return (
        <div className="bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
                <div>
                    {/* Other input fields */}
                    <button
                        onClick={handleSubmit}
                        className={`w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300`}
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}
