import React from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import { useAuth } from '../contexts/AuthContext';

const App: React.FC = () => {
  const { currentUser: user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {user ? (
        <Dashboard user={user} />
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App; 