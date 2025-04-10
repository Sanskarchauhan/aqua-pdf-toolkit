
import React, { createContext, useContext, useState, useEffect } from 'react';

// User type definition
interface User {
  id: string;
  name: string;
  email: string;
}

// Auth context type definition
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Mock database of users (in a real app, this would be stored in a database)
const USERS_STORAGE_KEY = 'aquapdf_users';
const AUTH_USER_KEY = 'aquapdf_current_user';

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Initialize on mount
  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Helper to get users from localStorage
  const getUsers = (): Record<string, User & { password: string }> => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : {};
  };

  // Helper to save users to localStorage
  const saveUsers = (users: Record<string, User & { password: string }>) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const users = getUsers();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (users[email] && users[email].password === password) {
      const currentUser = {
        id: users[email].id,
        name: users[email].name,
        email: users[email].email,
      };
      
      setUser(currentUser);
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
      return true;
    }
    
    return false;
  };

  // Signup function
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const users = getUsers();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (users[email]) {
      return false;
    }
    
    // Create new user
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
    };
    
    users[email] = newUser;
    saveUsers(users);
    
    // Auto login after signup
    const currentUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };
    
    setUser(currentUser);
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
    
    return true;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        login, 
        signup, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
