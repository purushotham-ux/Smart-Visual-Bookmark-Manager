import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import Login from './Login';
import { useAuth } from '../contexts/AuthContext';
import { ThemeProvider } from '../hooks/useTheme.js';
import Icon from './ui/Icon';
import { User } from '../types/User';
import { NotificationProvider } from '../contexts/NotificationContext';

const App: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

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

    if (currentUser) {
      const { uid, email, displayName, photoURL } = currentUser;
      setUser({
        uid,
        email: email || '',
        displayName: displayName || '',
        photoURL: photoURL || '',
      });
    } else {
      setUser(null);
    }

    return () => clearTimeout(timer);
  }, [loading, currentUser]);

  if (initialLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <div className="h-24 w-24 rounded-xl bg-primary-500 dark:bg-primary-600 flex items-center justify-center shadow-lg">
              <Icon name="bookmark" size="xl" className="text-white" />
            </div>
            <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full border-4 border-white dark:border-gray-800 bg-primary-100 dark:bg-gray-700 animate-pulse"></div>
            <div className="absolute -left-2 -bottom-2 w-6 h-6 rounded-full border-4 border-white dark:border-gray-800 bg-primary-200 dark:bg-gray-600 animate-pulse delay-300"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">VisualMarks</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md px-6 py-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse delay-150"></div>
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse delay-300"></div>
              <span className="text-gray-600 dark:text-gray-300 ml-1">Loading your bookmarks</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen w-full font-sans">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950"></div>
        
        {/* Animated background dots/circles effect */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-[10%] left-[15%] w-[35rem] h-[35rem] bg-blue-500 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"></div>
          <div className="absolute top-[40%] right-[15%] w-[30rem] h-[30rem] bg-red-500 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center h-screen">
          <div className="bg-white/[0.08] backdrop-blur-md rounded-xl shadow-2xl overflow-hidden max-w-md w-full p-8">
            <div className="flex flex-col items-center">
              <div className="mb-6 p-3 bg-red-900/40 rounded-full">
                <Icon name="close" size="xl" className="text-red-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3 text-center">Authentication Error</h2>
              <p className="text-slate-400 mb-6 text-center">{authError}</p>
              
              <button 
                onClick={() => window.location.reload()}
                className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <NotificationProvider>
        {user ? (
          <Dashboard user={user} />
        ) : (
          <Login />
        )}
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App; 