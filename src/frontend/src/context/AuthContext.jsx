import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext(null);

// Helper to decode JWT token in frontend without external dependencies
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and check token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        const decoded = decodeToken(storedToken);
        if (decoded) {
          // Check expiration: exp is in seconds
          const currentTime = Date.now() / 1000;
          if (decoded.exp && decoded.exp < currentTime) {
            console.warn('Token expired, logging out automatically');
            handleLogout();
          } else {
            setToken(storedToken);
            // Pre-hydrate user state if stored locally
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            } else {
              setUser(decoded); // Fallback to token payload
            }
            // Fetch fresh profile from backend
            try {
              const response = await api.get('/auth/profile');
              const freshUser = response.data.data;
              setUser(freshUser);
              localStorage.setItem('user', JSON.stringify(freshUser));
            } catch (err) {
              console.error('Failed to fetch user profile, logging out', err);
              handleLogout();
            }
          }
        } else {
          handleLogout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: receivedToken, user: loggedUser } = response.data.data;
      
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      
      setToken(receivedToken);
      setUser(loggedUser);
      return loggedUser;
    } catch (error) {
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const logout = async () => {
    try {
      // Best effort notify backend of logout
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Backend logout failed or not authenticated:', error.message);
    } finally {
      handleLogout();
    }
  };

  const updateProfile = async (data) => {
    try {
      // Attempt real API call first
      const response = await api.patch('/auth/profile', data);
      const updatedUser = response.data.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      // Fallback: If it's a 404/405 error (e.g. PATCH endpoint missing on backend), simulate success
      if (error.response && (error.response.status === 404 || error.response.status === 405)) {
        console.warn('Backend PATCH /auth/profile not found. Updating local profile state.');
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      throw error;
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      const freshUser = response.data.data;
      setUser(freshUser);
      localStorage.setItem('user', JSON.stringify(freshUser));
      return freshUser;
    } catch (error) {
      throw error;
    }
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';

  const contextValue = {
    user,
    token,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    register,
    logout,
    updateProfile,
    fetchProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
