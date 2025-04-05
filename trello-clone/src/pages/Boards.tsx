import React from 'react';
import BoardList from './boards/BoardList';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Boards: React.FC = () => {
  const { state } = useAuth();
  const { isAuthenticated } = state;

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <BoardList />;
};

export default Boards; 