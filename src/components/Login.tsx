import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme.js';
import Icon from './ui/Icon';

const Login: React.FC = () => {
  const { signInWithEmailAuth, signInWithGoogleAuth, signInWithGithubAuth, registerWithEmailAuth } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
    
    setIsLoading(true);
    
    try {
      if (isLoginMode) {
        await signInWithEmailAuth(email, password);
      } else {
        await registerWithEmailAuth(email, password);
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

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 font-sans login-container">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/70 to-slate-900 dark:from-gray-950 dark:via-blue-950/80 dark:to-gray-950"></div>
      
      {/* Animated background dots/circles effect */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-[10%] left-[15%] w-[35rem] h-[35rem] bg-blue-500 rounded-full mix-blend-multiply filter blur-[80px] animate-blob"></div>
        <div className="absolute top-[40%] right-[15%] w-[30rem] h-[30rem] bg-indigo-500 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[35%] w-[30rem] h-[30rem] bg-violet-500 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Particles/stars background effect */}
      <div className="particles-container absolute inset-0 z-0"></div>
      
      {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
        className="absolute top-4 right-4 z-10 p-2 rounded-full text-gray-400 hover:text-white bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/70 transition-all duration-300 shadow-lg focus:outline-none"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
        <Icon name={isDarkMode ? "sun" : "moon"} size="md" />
      </button>
      
      <div className="relative z-10 w-full max-w-screen-xl mx-auto">
        <div className="w-full md:w-1/2 max-w-md mx-auto animate-fade-in-up">
          <div 
            className={`bg-slate-900/60 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden transition-all duration-300 transform ${isAnimating ? 'scale-95 opacity-90' : 'scale-100 opacity-100'} glow-effect`}
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
                    <div className="bg-gradient-to-r from-primary-600 to-primary-500 w-24 h-24 rounded-xl flex items-center justify-center shadow-lg transform transition-transform hover:rotate-6">
                      <svg className="w-14 h-14 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 4H7C5.9 4 5.01 4.9 5.01 6L5 20L12 17L19 20V6C19 4.9 18.1 4 17 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-primary-300 border-2 border-slate-900"></div>
                  </div>
      </div>

                <h2 className="text-2xl font-bold mb-2 text-center gradient-text">
                  {isLoginMode ? 'Welcome back' : 'Create account'}
                </h2>
                <p className="text-slate-400 text-sm text-center">
                  {isLoginMode ? 'Sign in to continue to your bookmarks' : 'Start organizing your online world'}
          </p>
        </div>
        
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
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400 group-hover:text-primary-400 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required={!isLoginMode}
                        className="bg-slate-800/50 border border-slate-700 text-white block w-full pl-10 pr-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-slate-600"
                        placeholder="Your name"
                      />
                    </div>
          </div>
        )}
        
                <div className="mb-6 group">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400 group-hover:text-primary-400 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                      className="bg-slate-800/50 border border-slate-700 text-white block w-full pl-10 pr-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-slate-600"
                      placeholder="you@example.com"
            />
                  </div>
          </div>
          
                <div className="mb-4 group">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
                    {isLoginMode && (
                      <button
                        type="button"
                        onClick={() => console.log("Forgot password")}
                        className="text-sm text-primary-400 hover:text-primary-300 focus:outline-none focus:underline transition-colors duration-200">
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400 group-hover:text-primary-400 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-white focus:outline-none"
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        )}
                      </button>
                    </div>
            <input
              id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
                      className="bg-slate-800/50 border border-slate-700 text-white block w-full pl-10 pr-10 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-slate-600"
              placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 border-slate-600 rounded focus:ring-primary-500 bg-slate-700"
                    />
                    <div className="hover-glow"></div>
                  </div>
                  <label htmlFor="remember" className="ml-2 block text-sm text-slate-400 hover:text-slate-300 transition-colors duration-200">
                    Remember me
                  </label>
          </div>

            <button
              type="submit"
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 rounded-lg text-white font-medium shadow-lg shadow-primary-900/20 transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                      <span>Processing...</span>
                    </div>
                  ) : isLoginMode ? "Sign in" : "Create account"}
            </button>
        </form>

              <div className="px-8 pb-8">
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-900/60 text-slate-400">Or continue with</span>
          </div>
        </div>
        
                <div className="grid grid-cols-2 gap-4">
          <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    className="flex items-center justify-center py-2.5 px-4 border border-slate-700 rounded-lg bg-slate-800/50 text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-200 hover:translate-y-[-2px] group"
                  >
                    <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#FFF"/>
            </svg>
                    <span className="group-hover:font-medium transition-all">Google</span>
          </button>
          
          <button
                    type="button"
                    onClick={() => handleSocialLogin('github')}
                    className="flex items-center justify-center py-2.5 px-4 border border-slate-700 rounded-lg bg-slate-800/50 text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-200 hover:translate-y-[-2px] group"
                  >
                    <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="#FFF"/>
            </svg>
                    <span className="group-hover:font-medium transition-all">GitHub</span>
          </button>
                </div>
        </div>
        
              <div className="px-8 py-6 bg-gradient-to-r from-slate-900/90 to-slate-800/90 border-t border-slate-800 text-center">
                <p className="text-sm text-slate-400">
                  {isLoginMode ? "Don't have an account?" : "Already have an account?"}
          <button 
                    type="button"
                    onClick={toggleMode}
                    className="ml-2 text-primary-400 hover:text-primary-300 focus:outline-none focus:underline transition-colors duration-200 font-medium"
          >
                    {isLoginMode ? "Sign up" : "Sign in"}
          </button>
                </p>
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