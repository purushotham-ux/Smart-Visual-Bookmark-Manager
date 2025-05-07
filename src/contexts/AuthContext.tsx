import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  auth, 
  signInWithGoogle, 
  signInWithGithub, 
  signInWithEmail, 
  registerWithEmail,
  resetPassword 
} from '../services/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../types/User';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogleAuth: () => Promise<void>;
  signInWithGithubAuth: () => Promise<void>;
  signInWithEmailAuth: (email: string, password: string) => Promise<void>;
  registerWithEmailAuth: (email: string, password: string, displayName: string) => Promise<void>;
  resetPasswordAuth: (email: string) => Promise<void>;
  logOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(`User authenticated: ${user.uid}`);
        // Convert Firebase user to our User type
        const appUser: User = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email || 'User',
          photoURL: user.photoURL || undefined
        };
        setCurrentUser(appUser);
        
        // Store basic user info in localStorage for recovery if needed
        try {
          localStorage.setItem('auth_user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email || 'User'
          }));
        } catch (error) {
          console.error('Failed to store user info in localStorage:', error);
        }
      } else {
        console.log('No user authenticated');
        setCurrentUser(null);
        try {
          localStorage.removeItem('auth_user');
        } catch (error) {
          console.error('Failed to remove user info from localStorage:', error);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogleAuth = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Failed to sign in with Google:', error);
      throw error;
    }
  };

  const signInWithGithubAuth = async () => {
    try {
      await signInWithGithub();
    } catch (error) {
      console.error('Failed to sign in with GitHub:', error);
      throw error;
    }
  };

  const signInWithEmailAuth = async (email: string, password: string) => {
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      console.error('Failed to sign in with email:', error);
      throw error;
    }
  };

  const registerWithEmailAuth = async (email: string, password: string, displayName: string) => {
    try {
      await registerWithEmail(email, password, displayName);
    } catch (error) {
      console.error('Failed to register with email:', error);
      throw error;
    }
  };

  const resetPasswordAuth = async (email: string) => {
    try {
      await resetPassword(email);
    } catch (error) {
      console.error('Failed to reset password:', error);
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Failed to log out:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      const user = auth.currentUser;
      const appUser: User = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email || 'User',
        photoURL: user.photoURL || undefined
      };
      setCurrentUser(appUser);
    }
  };

  const value = {
    currentUser,
    loading,
    signInWithGoogleAuth,
    signInWithGithubAuth,
    signInWithEmailAuth,
    registerWithEmailAuth,
    resetPasswordAuth,
    logOut,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 