import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  
    useEffect(() => {
      const role = localStorage.getItem('userData');
      if (role) {
        if (role === 'Admin') {
          setUser(true);
        } else {
          setUser(false);
        }
      } else {
        setUser(false);
      }
    }, []);
  
    if (user === null) {
      return <div>Loading...</div>;
    }
  
    if (user === false) {
      return <Navigate to="/" />;
    }
  
    return children;
  };

export default ProtectedRoute;
