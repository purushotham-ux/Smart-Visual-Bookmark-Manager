import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme.js';
import Icon from './ui/Icon';

const Login: React.FC = () => {
  const { signInWithEmailAuth, signInWithGoogleAuth, signInWithGithubAuth, registerWithEmailAuth, resetPasswordAuth } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [resetSent, setResetSent] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>('');

  // Handle animation on mode change
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [isLoginMode]);

  const toggleMode = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLoginMode(!isLoginMode);
      setIsAnimating(false);
    }, 300);
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    setError(null);
    setIsLoading(true);
    
    try {
      if (provider === 'google') {
        signInWithGoogleAuth();
      } else if (provider === 'github') {
        signInWithGithubAuth();
      }
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      setError(`Failed to sign in with ${provider}. Please try again.`);
      setIsLoading(false);
    }
  };

  const handleEmailPasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    if (!isLoginMode && !displayName) {
      setError('Name is required for registration');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isLoginMode) {
        await signInWithEmailAuth(email, password);
      } else {
        await registerWithEmailAuth(email, password, displayName);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(isLoginMode 
        ? 'Failed to sign in. Please check your credentials and try again.' 
        : 'Failed to sign up. This email may already be in use.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      await signInWithGoogleAuth();
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Failed to sign in with Google. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      await signInWithGithubAuth();
    } catch (error) {
      console.error('GitHub sign in error:', error);
      setError('Failed to sign in with GitHub. Please try again.');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await resetPasswordAuth(email);
      setResetSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Failed to send password reset email. Please check your email address and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 font-sans login-container">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-900/70 to-gray-900 dark:from-gray-950 dark:via-primary-950/80 dark:to-gray-950"></div>
      
      {/* Animated background dots/circles effect */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-[10%] left-[15%] w-[35rem] h-[35rem] bg-accent-blue rounded-full mix-blend-multiply filter blur-[80px] animate-blob"></div>
        <div className="absolute top-[40%] right-[15%] w-[30rem] h-[30rem] bg-accent-purple rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[35%] w-[30rem] h-[30rem] bg-accent-teal rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Particles/stars background effect */}
      <div className="particles-container absolute inset-0 z-0"></div>
      
      {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
        className="absolute top-4 right-4 z-10 p-2.5 rounded-full text-gray-400 hover:text-white bg-gray-800/60 backdrop-blur-sm hover:bg-gray-700/70 transition-all duration-300 shadow-lg focus:outline-none"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
        <Icon name={isDarkMode ? "sun" : "moon"} size="md" className={isDarkMode ? "text-amber-400" : "text-primary-500"} />
      </button>
      
      <div className="relative z-10 w-full max-w-screen-xl mx-auto">
        <div className="w-full md:w-1/2 max-w-md mx-auto animate-fade-in-up">
          <div 
            className={`bg-white/5 dark:bg-gray-900/40 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden transition-all duration-300 transform ${isAnimating ? 'scale-95 opacity-90' : 'scale-100 opacity-100'} border border-white/10`}
          >
            {/* Decorative SVG Background */}
            <div className="login-svg-bg">
              <svg width="120%" height="120%" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(300,300)">
                  <path d="M153.6,-196.8C194.1,-161.3,220.4,-110.9,229.4,-59.2C238.5,-7.5,230.4,45.5,203.7,86.2C177,127,131.8,155.5,81.7,182.3C31.5,209.1,-23.7,234.2,-74.6,223.8C-125.5,213.5,-172.2,167.8,-208.2,114.1C-244.2,60.5,-269.5,-0.9,-252.9,-49.5C-236.3,-98.1,-177.7,-133.8,-126.2,-168.2C-74.7,-202.6,-30.3,-235.8,16.7,-256.3C63.7,-276.8,113.1,-232.3,153.6,-196.8Z" fill="currentColor" />
                </g>
            </svg>
            </div>
            
            <div className="form-container">
              <div className="px-8 pt-8 pb-2">
                {/* Logo SVG */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="bg-gradient-primary w-24 h-24 rounded-xl flex items-center justify-center shadow-blue-glow transform transition-transform hover:rotate-6">
                      <svg className="w-14 h-14 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 4H7C5.9 4 5.01 4.9 5.01 6L5 20L12 17L19 20V6C19 4.9 18.1 4 17 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <div className="px-2">
                    <h1 className="text-xl font-bold mb-2 text-center text-gradient-primary">Bookmark Hub</h1>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-2 text-center text-gradient-secondary">
                  {isLoginMode ? 'Welcome back' : 'Create account'}
                </h2>
                <p className="text-gray-400 text-sm text-center">
                  {isLoginMode ? 'Sign in to continue to your bookmarks' : 'Start organizing your online world'}
          </p>
        </div>
              
              {/* Show reset password success message inside the form container */}
              {resetSent && (
                <div className="mx-8 my-4 bg-green-900/40 border border-green-800/50 rounded-lg px-4 py-3">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Icon name="star" className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-300">Password reset email sent! Please check your inbox.</p>
                    </div>
                  </div>
                </div>
              )}
        
        {error && (
                <div className="mx-8 my-4 bg-red-900/40 border border-red-800/50 rounded-lg px-4 py-3 animate-pulse">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Icon name="close" className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleEmailPasswordAuth} className="px-8 pt-6 pb-8">
                {!isLoginMode && (
                  <div className="mb-6 group">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-hover:text-primary-400 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required={!isLoginMode}
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="bg-gray-800/50 border border-gray-700 text-white block w-full pl-10 pr-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-600"
                        placeholder="Your name"
                      />
                    </div>
          </div>
        )}
        
                <div className="mb-6 group">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-hover:text-primary-400 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>
            <input
              id="email"
                      name="email"
              type="email"
                      required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800/50 border border-gray-700 text-white block w-full pl-10 pr-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-600"
                      placeholder="Your email"
            />
                  </div>
          </div>
          
                <div className="mb-6 group">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    {isLoginMode && (
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-sm text-primary-400 hover:text-primary-300 focus:outline-none focus:underline transition-colors duration-200"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-hover:text-primary-400 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
            <input
              id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-800/50 border border-gray-700 text-white block w-full pl-10 pr-10 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-600"
                      placeholder="Your password"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-300 focus:outline-none focus:text-gray-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Icon name={showPassword ? "star" : "close"} size="sm" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-8 mb-2">
            <button
              type="submit"
                    disabled={isLoading}
                    className={`w-full bg-gradient-primary text-white py-2.5 px-4 rounded-lg font-medium transition-all duration-300 hover:shadow-blue-glow transform hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                      <span>Processing...</span>
                    </div>
                    ) : (
                      <>{isLoginMode ? 'Sign in' : 'Create account'}</>
                    )}
                  </button>
                </div>
                
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-400">
                    {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="font-medium text-primary-400 hover:text-primary-300 focus:outline-none focus:underline transition-colors duration-200"
                    >
                      {isLoginMode ? 'Sign up' : 'Sign in'}
            </button>
                  </p>
                </div>
        </form>

              <div className="px-8 pb-8">
                <div className="relative">
          <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
          </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
          </div>
        </div>
        
                <div className="mt-6 grid grid-cols-2 gap-4">
          <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full inline-flex justify-center py-2.5 px-4 rounded-lg bg-white/10 hover:bg-white/20 border border-gray-700 shadow-sm text-sm font-medium text-white transition-all duration-200"
                  >
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/>
                      <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078-3.12 0-5.776-2.107-6.718-4.928L1.214 17.28A11.988 11.988 0 0 0 12 24c2.947 0 5.705-1.031 7.734-2.975l-3.694-3.012Z"/>
                      <path fill="#4285F4" d="M19.734 21.025C21.92 18.907 23.4 15.62 23.4 12c0-.96-.093-1.892-.263-2.8H12v5.6h6.458a5.445 5.445 0 0 1-2.386 3.513l3.662 2.712Z"/>
                      <path fill="#FBBC05" d="M5.242 14.163a7.18 7.18 0 0 1 0-4.326L1.216 6.722a12.01 12.01 0 0 0 0 10.556l4.026-3.115Z"/>
            </svg>
                    Google
          </button>
          
          <button
                    type="button"
                    onClick={handleGithubSignIn}
                    className="w-full inline-flex justify-center py-2.5 px-4 rounded-lg bg-white/10 hover:bg-white/20 border border-gray-700 shadow-sm text-sm font-medium text-white transition-all duration-200"
                  >
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
                    GitHub
          </button>
                </div>
              </div>
            </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 

// Add this to global CSS or create a new style tag
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.login-container {
  font-family: 'Poppins', sans-serif;
  letter-spacing: -0.01em;
}

input, button {
  font-family: 'Poppins', sans-serif;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.gradient-text {
  background: linear-gradient(90deg, #4F46E5 0%, #60A5FA 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-svg-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  opacity: 0.08;
  z-index: 0;
  pointer-events: none;
}

.form-container {
  position: relative;
  z-index: 1;
}

.particles-container {
  background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.1) 1px, transparent 0);
  background-size: 40px 40px;
  animation: particles-drift 100s linear infinite;
}

@keyframes particles-drift {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 1000px 1000px;
  }
}

.glow-effect {
  box-shadow: 0 0 40px rgba(66, 153, 225, 0.1);
  transition: box-shadow 0.3s ease;
}

.glow-effect:hover {
  box-shadow: 0 0 50px rgba(79, 70, 229, 0.2);
}

.hover-glow {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0) 70%);
  opacity: 0;
  transform: scale(0);
  transition: transform 0.3s, opacity 0.3s;
}

input:focus + .hover-glow,
input:hover + .hover-glow {
  opacity: 1;
  transform: scale(2);
}
`;

// Inject the styles into the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
} 