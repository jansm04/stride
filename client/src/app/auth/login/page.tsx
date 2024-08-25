"use client";

import { useState } from "react";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  // State to manage form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (username == "" || password == "") {
      setError('Please fill out all required fields.');
      return;
    }
    setError('');

    // Prepare data to send to backend
    const loginCredentials = {
      username,
      password
    };

    try {
      // Send data to authentication microservice
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginCredentials),
      });
      const data = await response.json();
      if (data.result === 'success') {
        console.log(data);
        
        // Store JWT in a cookie
        Cookies.set('accessToken', data.accessToken);
        Cookies.set('refreshToken', data.refreshToken);        
        // store user id in a cookie
        Cookies.set('userId', data.user.userId);

        // Redirect to the view plan page or another page
        router.push('/');
      } else {
        setError(data.error ? 
          data.error : 
          "Registration failed. Please try again."
        );
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };
  
  return (
    <div className="min-h-screen bg-wavy-gradient flex items-center justify-center">
      <form
        className="bg-blue-darker p-8 rounded-lg shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center text-cyan-500 mb-6">Log in to your account.</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-light mb-2" htmlFor="username">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="username"
            className="w-full p-2 bg-blue-darker text-white border border-[--cyan] rounded-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-light mb-2" htmlFor="password">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-2 bg-blue-darker text-white border border-[--cyan] rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="mb-6 w-full py-2 px-4 mt-4 bg-cyan hover:bg-[--cyan-dark] text-gray-900 font-bold rounded focus:outline-none transition-colors duration-200"
        >
          Log In
        </button>

        <div className="mb-2 text-center">
          <Link 
            href='/auth/register'
            className="text-gray-600 text-xs hover:text-[--cyan] hover:underline">
              Don't have an account? Register here.
          </Link>
        </div>

        <div className="text-center">
          <Link 
            href='/'
            className="text-gray-600 text-xs hover:text-[--cyan] hover:underline">
              Continue without an account.
          </Link>
        </div>
      </form>
    </div>
  );
}
