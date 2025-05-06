import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import Login from './Login';
import { useAuth } from '../contexts/AuthContext';
import { ThemeProvider } from '../hooks/useTheme.js';
import Icon from './ui/Icon';

const App: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Add a small delay to avoid flash of login screen if user is already logged in
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 500);

    // Try to recover from localStorage if Firebase auth is failing
    if (!loading && !currentUser) {
      try {
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser) {
          console.log('Found stored user info, but Firebase auth failed to initialize. This might be a temporary network issue.');
        }
      } catch (error) {
        console.error('Error checking local storage:', error);
      }
    }

    return () => clearTimeout(timer);
  }, [loading, currentUser]);

  if (initialLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary-300 mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading your bookmarks...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md w-full">
          <div className="flex items-center justify-center mb-4 text-error-500">
            <Icon name="close" size="xl" className="text-error-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 text-center">Authentication Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">{authError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      {currentUser ? (
        <Dashboard user={currentUser} />
      ) : (
        <Login />
      )}
    </ThemeProvider>
  );
};

export default App; 