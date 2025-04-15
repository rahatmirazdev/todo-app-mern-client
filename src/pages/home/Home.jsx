import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="py-10">
      <h2 className="font-bold text-center text-3xl font-rose">Welcome to the Home Page</h2>
      <p className="text-center mt-6 text-lg">This is the landing page of our application</p>

      {user ? (
        <div className="mt-10 text-center">
          <p className="mb-4">You are logged in as {user.name}</p>
          <Link
            to="/dashboard"
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 border border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;