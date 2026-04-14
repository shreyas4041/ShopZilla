

import React from 'react';

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-primary focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-accent-hover',
    outline: 'border border-accent text-accent hover:bg-accent/10',
    ghost: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary',
  };

  const sizeClasses = 'px-5 py-2 text-sm';

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, id, name, type = 'text', ...props }) => {
  return (
    <div>
      <label htmlFor={id || name} className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={id || name}
        name={name}
        className="block w-full px-4 py-3 border rounded-md shadow-sm sm:text-sm bg-white dark:bg-primary border-gray-300 dark:border-gray-600 text-textDark dark:text-textLight focus:ring-accent focus:border-accent"
        {...props}
      />
    </div>
  );
};

// --- Card ---
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-secondary rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// --- Spinner ---
export const Spinner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent ${className}`}></div>
  );
};

// --- Skeleton ---
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}></div>
  );
};
