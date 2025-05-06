import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'icon';
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
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all';
  
  // Size specific classes
  const sizeClasses = {
    sm: 'text-small py-1 px-3',
    md: 'text-body py-2 px-4',
    lg: 'text-h4 py-3 px-6',
  };
  
  // Variant specific classes
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-600 active:bg-primary-700 text-white border border-transparent',
    secondary: 'bg-transparent hover:bg-primary-50 active:bg-primary-100 text-primary border border-primary',
    tertiary: 'bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700 border border-transparent',
    icon: 'bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700 rounded-full p-2',
  };
  
  // Disabled state classes
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  
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
        <span className={`mr-2 ${isLoading ? 'opacity-0' : ''}`}>
          {leftIcon}
        </span>
      )}
      
      {/* Button Text */}
      <span className={isLoading ? 'opacity-0' : ''}>
        {children}
      </span>
      
      {/* Right Icon */}
      {rightIcon && (
        <span className={`ml-2 ${isLoading ? 'opacity-0' : ''}`}>
          {rightIcon}
        </span>
      )}
      
      {/* Loading Spinner */}
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
    </button>
  );
};

export default Button; 