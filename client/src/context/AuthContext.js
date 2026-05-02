import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../utils/axios';
import { API_URL } from '../config';
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem("token");

    if (token) {
     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    
    const { token, user: userData } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    
    return response.data;
  };

  const register = async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    
    const { token, user: newUser } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(newUser);
    
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
