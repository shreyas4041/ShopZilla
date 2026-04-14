
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../App';
import type { User } from '../types';

interface ProtectedRouteProps {
  children: React.ReactElement;
  roles: User['role'][];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // User not logged in, redirect to auth page
    return <Navigate to="/auth" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    // User does not have the required role, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
