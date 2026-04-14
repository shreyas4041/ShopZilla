import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h1 className="text-6xl font-extrabold text-accent">404</h1>
      <p className="text-2xl font-semibold mt-4 text-textDark dark:text-textLight">Page Not Found</p>
      <p className="text-gray-500 dark:text-gray-400 mt-2">Sorry, the page you are looking for does not exist.</p>
      <div className="mt-8">
        <Link to="/">
          <Button>Go to Homepage</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;