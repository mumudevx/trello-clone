import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState } from '../utils/types';
import { getItem, setItem, STORAGE_KEYS, removeItem } from '../utils/localStorage';
import { generateId } from '../utils/helpers';

// Define actions
type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SIGNUP_SUCCESS'; payload: User }
  | { type: 'SIGNUP_FAILURE'; payload: string }
  | { type: 'LOADING' };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  error: null,
  loading: false,
};

// Create context
const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (username: string, email: string, password: string) => Promise<void>;
}>({
  state: initialState,
  login: async () => {},
  logout: () => {},
  signup: async () => {},
});

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null,
        loading: false,
      };
    case 'LOGIN_FAILURE':
    case 'SIGNUP_FAILURE':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...initialState,
      };
    case 'LOADING':
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing user on mount
  useEffect(() => {
    const user = getItem<User | null>(STORAGE_KEYS.USER, null);
    if (user) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    }
  }, []);

  // Login function (mock implementation)
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'LOADING' });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation (in real app, this would be server-side)
      if (email === 'test@example.com' && password === 'password') {
        const user: User = {
          id: 'user-1',
          username: 'Test User',
          email,
        };
        setItem(STORAGE_KEYS.USER, user);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid email or password' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
    }
  };

  // Signup function (mock implementation)
  const signup = async (username: string, email: string, password: string) => {
    try {
      dispatch({ type: 'LOADING' });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a secure user object - in a real app we'd hash the password
      const user: User = {
        id: generateId(),
        username,
        email,
      };
      setItem(STORAGE_KEYS.USER, user);
      dispatch({ type: 'SIGNUP_SUCCESS', payload: user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed. Please try again.';
      dispatch({ type: 'SIGNUP_FAILURE', payload: errorMessage });
    }
  };

  // Logout function
  const logout = () => {
    removeItem(STORAGE_KEYS.USER);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext; 