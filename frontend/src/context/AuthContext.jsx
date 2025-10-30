import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // LocalStorage dan foydalanuvchini olish
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Ro\'yxatdan o\'tishda xatolik',
      };
    }
  };

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Tizimga kirishda xatolik',
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = async () => {
    try {
      const data = await authService.getCurrentUser();
      setUser(data);
    } catch (error) {
      console.error('Foydalanuvchi ma\'lumotlarini olishda xatolik:', error);
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
