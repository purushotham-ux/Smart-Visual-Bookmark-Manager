import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'icon' | 'gradient' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  children?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...rest
}) => {
  // Base classes for all buttons
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-all duration-200';
  
  // Size specific classes
  const sizeClasses = {
    sm: 'text-small py-1.5 px-3.5',
    md: 'text-body py-2.5 px-5',
    lg: 'text-h4 py-3.5 px-7',
  };
  
  // Variant specific classes
  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white border border-transparent shadow-sm hover:shadow-md',
    secondary: 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md',
    tertiary: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 text-gray-700 dark:text-gray-300 border border-transparent',
    icon: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full p-2',
    gradient: 'bg-gradient-primary hover:bg-gradient-primary text-white border border-transparent shadow-md hover:shadow-blue-glow transition-shadow',
    glass: 'backdrop-blur-sm bg-white/20 dark:bg-gray-900/20 hover:bg-white/30 dark:hover:bg-gray-900/30 text-gray-800 dark:text-white border border-white/30 dark:border-gray-700/30 shadow-sm hover:shadow-md',
  };
  
  // Disabled state classes
  const disabledClasses = 'opacity-60 cursor-not-allowed shadow-none';
  
  // Loading state classes
  const loadingClasses = 'relative text-transparent';
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${disabled || isLoading ? disabledClasses : ''}
    ${isLoading ? loadingClasses : ''}
    ${widthClasses}
    ${className}
  `;
  
  return (
    <button 
      className={buttonClasses} 
      disabled={disabled || isLoading}
      {...rest}
    >
      {/* Left Icon */}
      {leftIcon && (
        <span className={`mr-2.5 ${isLoading ? 'opacity-0' : ''}`}>
          {leftIcon}
        </span>
      )}
      
      {/* Button Text */}
      <span className={isLoading ? 'opacity-0' : ''}>
        {children}
      </span>
      
      {/* Right Icon */}
      {rightIcon && (
        <span className={`ml-2.5 ${isLoading ? 'opacity-0' : ''}`}>
          {rightIcon}
        </span>
      )}
      
      {/* Loading Spinner */}
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
    </button>
  );
};

export default Button; 