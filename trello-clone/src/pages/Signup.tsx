import React from 'react';
import SignupForm from '../components/auth/SignupForm';

const Signup: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <SignupForm />
    </div>
  );
};

export default Signup; 