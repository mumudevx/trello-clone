import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { state } = useAuth();
  const { isAuthenticated } = state;

  return (
    <div className="container mx-auto p-4">
      <div className="text-center my-12">
        <h2 className="text-3xl font-bold text-white-800 mb-4">Welcome to Trello Clone</h2>
        <p className="text-gray-600 max-w-lg mx-auto mb-8">
          A simple Trello clone built with React and Tailwind CSS. This project will help you
          organize your tasks with boards, lists, and cards.
        </p>
        
        {isAuthenticated ? (
          <Link 
            to="/boards" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            My Boards
          </Link>
        ) : (
          <div className="space-x-4">
            <Link 
              to="/login" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Create Boards</h3>
          <p className="text-gray-600">Organize your projects into boards, where each board contains lists of tasks.</p>
        </div>
        <div className="p-6 border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Manage Tasks</h3>
          <p className="text-gray-600">Create cards for tasks and move them between lists as they progress.</p>
        </div>
        <div className="p-6 border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Stay Organized</h3>
          <p className="text-gray-600">Use labels, drag and drop, and other features to keep your projects on track.</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 