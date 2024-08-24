"use client";

import { useState } from "react";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  // State to manage form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (username == "" || password == "" || confirmPassword == "") {
      setError('Please fill out all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');

    // Prepare data to send to backend
    const registrationData = {
      username,
      password,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
    };

    try {
      // Send data to authentication microservice
      const response = await fetch('<backend url>/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });
      const data = await response.json();
      if (data.result === 'success') {
        // Store JWT in a cookie
        Cookies.set('accessToken', data.accessToken);
        Cookies.set('refreshToken', data.refreshToken);

        // Redirect to the view plan page or another page
        router.push('/');
      } else {
        setError(data.error ? 
          "Sorry! That username is already taken." : 
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
        <h2 className="text-2xl font-bold text-center text-cyan-500 mb-6">Create your account.</h2>

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

        <div className="mb-4">
          <label className="block text-gray-light mb-2" htmlFor="confirmPassword">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full p-2 bg-blue-darker text-white border border-[--cyan] rounded-md"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-light mb-2" htmlFor="firstName">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            className="w-full p-2 bg-blue-darker text-white border border-[--cyan] rounded-md"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label className="block text-gray-light mb-2" htmlFor="lastName">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            className="w-full p-2 bg-blue-darker text-white border border-[--cyan] rounded-md"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="mb-6 w-full py-2 px-4 mt-4 bg-cyan hover:bg-[--cyan-dark] text-gray-900 font-bold rounded focus:outline-none transition-colors duration-200"
        >
          Register
        </button>

        <div className="text-center">
          <Link 
            href='/auth/login'
            className="text-gray-600 text-xs hover:text-[--cyan] hover:underline">
              Already have an account? Log in here.
          </Link>
        </div>

        <div className="mb-2 text-center">
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
