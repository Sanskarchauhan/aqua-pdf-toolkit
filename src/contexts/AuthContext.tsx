
import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

// User type definition
interface User {
  id: string;
  name: string;
  email: string;
  isSubscribed: boolean;
  trialCount: number;
}

// Auth context type definition
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  increaseTrialCount: () => void;
  upgradeToSubscription: () => void;
  isLoading: boolean;
  hasAvailableTrials: boolean;
}

// Mock database of users (in a real app, this would be stored in a database)
const USERS_STORAGE_KEY = 'aquapdf_users';
const AUTH_USER_KEY = 'aquapdf_current_user';
const MAX_FREE_TRIALS = 3;

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  increaseTrialCount: () => {},
  upgradeToSubscription: () => {},
  isLoading: false,
  hasAvailableTrials: false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Calculate if the user has available trials
  const hasAvailableTrials = user ? (user.isSubscribed || user.trialCount < MAX_FREE_TRIALS) : false;

  // Initialize on mount
  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
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
    setIsLoading(true);
    // In a real app, this would be an API call
    const users = getUsers();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (users[email] && users[email].password === password) {
      const currentUser = {
        id: users[email].id,
        name: users[email].name,
        email: users[email].email,
        isSubscribed: users[email].isSubscribed || false,
        trialCount: users[email].trialCount || 0,
      };
      
      setUser(currentUser);
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  // Signup function
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // In a real app, this would be an API call
    const users = getUsers();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (users[email]) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      isSubscribed: false,
      trialCount: 0,
    };
    
    users[email] = newUser;
    saveUsers(users);
    
    // Auto login after signup
    const currentUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      isSubscribed: newUser.isSubscribed,
      trialCount: newUser.trialCount,
    };
    
    setUser(currentUser);
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
    setIsLoading(false);
    
    return true;
  };

  // Increase trial count function
  const increaseTrialCount = () => {
    if (!user) return;
    
    const users = getUsers();
    const updatedUser = users[user.email];
    
    if (updatedUser) {
      // Only increase if not subscribed
      if (!updatedUser.isSubscribed) {
        updatedUser.trialCount = (updatedUser.trialCount || 0) + 1;
        users[user.email] = updatedUser;
        saveUsers(users);
        
        // Update local user state
        const newUserState = {
          ...user,
          trialCount: updatedUser.trialCount
        };
        
        setUser(newUserState);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUserState));
        
        if (updatedUser.trialCount >= MAX_FREE_TRIALS) {
          toast({
            title: "Trial limit reached",
            description: "You've reached the limit of free trials. Please upgrade to continue using all features.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Trial usage",
            description: `You have ${MAX_FREE_TRIALS - updatedUser.trialCount} free trials remaining.`,
          });
        }
      }
    }
  };

  // Upgrade to subscription
  const upgradeToSubscription = () => {
    if (!user) return;
    
    const users = getUsers();
    const updatedUser = users[user.email];
    
    if (updatedUser) {
      updatedUser.isSubscribed = true;
      users[user.email] = updatedUser;
      saveUsers(users);
      
      // Update local user state
      const newUserState = {
        ...user,
        isSubscribed: true
      };
      
      setUser(newUserState);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUserState));
      
      toast({
        title: "Subscription activated",
        description: "Thank you! You now have full access to all features.",
      });
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    signup,
    logout,
    increaseTrialCount,
    upgradeToSubscription,
    isLoading,
    hasAvailableTrials,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
