import { createContext, useState, useEffect, useCallback } from "react";
import * as authService from "../services/authService.js";

// Create Auth context
const AuthContext = createContext();

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage - runs once on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        // FIX 1: Use getItem, not setItem
        const token = localStorage.getItem('token');
        const userJson = localStorage.getItem('user');

        if (token && userJson) {
          try {
            const userData = JSON.parse(userJson);
            setUser(userData);
            setIsAuthenticated(true);
          } catch (parseErr) {
            console.error('Error parsing stored user:', parseErr);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []); // Empty dependency array - runs only once on mount

  // Login function
  const login = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.login(userData);
      if (res.success) {
        setUser(res.user);
        setIsAuthenticated(true);
        // FIX 2: Store token and user with both key and value
        localStorage.setItem('token', res.token || '');
        localStorage.setItem('user', JSON.stringify(res.user));
      } else {
        setError(res.message || 'Login failed');
      }
      setIsLoading(false);
      return res;
    } catch (error) {
      setIsLoading(false);
      const errorMsg = error.response?.data?.message || 'Invalid Email or Password';
      setError(errorMsg);
      return {
        success: false,
        message: errorMsg,
      };
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.register(userData);
      if (res.success) {
        setUser(res.user);
        setIsAuthenticated(true);
        // FIX 2: Store token and user with both key and value
        localStorage.setItem('token', res.token || '');
        localStorage.setItem('user', JSON.stringify(res.user));
      } else {
        setError(res.message || 'Registration failed');
      }
      setIsLoading(false);
      return res;
    } catch (error) {
      setIsLoading(false);
      const errorMsg = error.response?.data?.message || 'Invalid Data';
      setError(errorMsg);
      return {
        success: false,
        message: errorMsg,
      };
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    try {
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      // FIX 3: Clear localStorage on logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, []);

  // Update user profile
  const updateUser = useCallback((userData) => {
    try {
      setUser(userData);
      // FIX 2: Store with both key and value, and stringify the data
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user profile');
    }
  }, []);

  // Context value
  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    updateUser,
    isAuthenticated,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;