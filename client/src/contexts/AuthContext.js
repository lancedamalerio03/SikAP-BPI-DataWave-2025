// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('sikap_user');
    const savedAuth = localStorage.getItem('sikap_auth');
    
    if (savedUser && savedAuth === 'true') {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // For MVP - simulate authentication
    // Later: Replace with actual API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const userData = {
            id: Date.now(),
            email: email,
            name: email.split('@')[0],
            loginTime: new Date().toISOString()
          };
          
          setUser(userData);
          setIsAuthenticated(true);
          
          // Store in localStorage for persistence
          localStorage.setItem('sikap_user', JSON.stringify(userData));
          localStorage.setItem('sikap_auth', 'true');
          
          resolve(userData);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000); // Simulate API delay
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('sikap_user');
    localStorage.removeItem('sikap_auth');
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


