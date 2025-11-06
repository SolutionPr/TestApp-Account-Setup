import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { AuthContextType, AuthState, RegistrationFormData } from '../types';
import authService from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    sessionToken: null,
    error: null,
    failedAttempts: 0,
    isLocked: false,
    lockoutEndTime: null,
  });

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const session = await authService.checkSession();
      if (session.valid && session.user) {
        setAuthState({
          user: session.user,
          isAuthenticated: true,
          isLoading: false,
          sessionToken: 'mock-session-token',
          error: null,
          failedAttempts: 0,
          isLocked: false,
          lockoutEndTime: null,
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          sessionToken: null,
          error: null,
          failedAttempts: 0,
          isLocked: false,
          lockoutEndTime: null,
        });
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        sessionToken: null,
        error: 'Session check failed',
        failedAttempts: 0,
        isLocked: false,
        lockoutEndTime: null,
      });
    }
  };

const register = async (data: RegistrationFormData): Promise<boolean> => {
  try {
    const { agreeToTerms, confirmPassword, ...cleaned } = data;
    const result = await authService.register(cleaned);
    if (result.user) { // if user is returned, registration succeeded
      setAuthState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
        sessionToken: result.token,
        error: null,
        failedAttempts: 0,
        isLocked: false,
        lockoutEndTime: null,
      });
      Alert.alert('Success', 'Your account has been created successfully.', [{ text: 'OK' }]);
      return true;
    }
    return false; // This line is rarely reached unless you change service logic
  } catch (error: any) {
    Alert.alert('Registration Failed', error.message || 'Please try again.', [{ text: 'OK' }]);
    setAuthState(prev => ({
      ...prev,
      error: error.message || 'Registration failed',
    }));
    return false;
  }
};


const login = async (
  email: string,
  password: string,
  rememberMe: boolean = false
): Promise<boolean> => {
  try {
    const result = await authService.login({ email, password });
    if (result.user) {
      setAuthState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
        sessionToken: result.token,
        error: null,
        failedAttempts: 0,
        isLocked: false,
        lockoutEndTime: null,
      });
      return true;
    }
    return false;
  } catch (error: any) {
    Alert.alert('Login Failed', error.message || 'Invalid email or password.', [{ text: 'OK' }]);
    setAuthState(prev => ({
      ...prev,
      error: error.message || 'Invalid credentials',
      failedAttempts: prev.failedAttempts + 1,
    }));
    return false;
  }
};


  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        sessionToken: null,
        error: null,
        failedAttempts: 0,
        isLocked: false,
        lockoutEndTime: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
