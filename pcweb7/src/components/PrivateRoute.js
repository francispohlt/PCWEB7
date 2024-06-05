import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const PrivateRoute = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator while checking auth state
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
