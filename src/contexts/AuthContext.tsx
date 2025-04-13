
import React, { createContext, useContext, useState, useEffect } from 'react';
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

// Define API endpoints - update these with your actual Hostinger PHP endpoints
const API_ENDPOINTS = {
  LOGIN: '/api/login.php',
  SIGNUP: '/api/signup.php',
  LOGOUT: '/api/logout.php',
  UPDATE_TRIAL: '/api/update_trial.php',
  UPGRADE: '/api/upgrade.php',
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Storage keys
const AUTH_USER_KEY = 'aquapdf_current_user';
const AUTH_USERS_KEY = 'aquapdf_users';
const MAX_FREE_TRIALS = 3;

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
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Error parsing stored user:", err);
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Function to make API calls
  const callApi = async (endpoint: string, data: any) => {
    try {
      // In development, we'll use localStorage as a fallback
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Using localStorage instead of API call');
        return null;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include', // Send cookies for session management
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      return null;
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // For development - use localStorage implementation
      if (process.env.NODE_ENV === 'development' || true) { // Always use localStorage for now
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || '{}');
        
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
      }
      
      // For production - use PHP API
      const result = await callApi(API_ENDPOINTS.LOGIN, { email, password });
      
      if (result && result.success) {
        const currentUser = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          isSubscribed: result.user.isSubscribed || false,
          trialCount: result.user.trialCount || 0,
        };
        
        setUser(currentUser);
        setIsAuthenticated(true);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // For development - use localStorage implementation
      if (process.env.NODE_ENV === 'development' || true) { // Always use localStorage for now
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || '{}');
        
        // Check if user already exists
        if (users[email]) {
          setIsLoading(false);
          return false;
        }
        
        // Generate a unique ID
        const id = crypto.randomUUID ? crypto.randomUUID() : 
              Math.random().toString(36).substring(2, 15) + 
              Math.random().toString(36).substring(2, 15);
        
        // Create new user
        const newUser = {
          id,
          name,
          email,
          password, // In real app this would be hashed
          isSubscribed: false,
          trialCount: 0,
        };
        
        users[email] = newUser;
        localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
        
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
      }
      
      // For production - use PHP API
      const result = await callApi(API_ENDPOINTS.SIGNUP, { name, email, password });
      
      if (result && result.success) {
        const currentUser = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          isSubscribed: result.user.isSubscribed || false,
          trialCount: result.user.trialCount || 0,
        };
        
        setUser(currentUser);
        setIsAuthenticated(true);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Increase trial count function
  const increaseTrialCount = async () => {
    if (!user) return;
    
    try {
      // For development - use localStorage implementation
      if (process.env.NODE_ENV === 'development' || true) { // Always use localStorage for now
        const users = JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || '{}');
        const updatedUser = users[user.email];
        
        if (updatedUser) {
          // Only increase if not subscribed
          if (!updatedUser.isSubscribed) {
            updatedUser.trialCount = (updatedUser.trialCount || 0) + 1;
            users[user.email] = updatedUser;
            localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
            
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
        return;
      }
      
      // For production - use PHP API
      const result = await callApi(API_ENDPOINTS.UPDATE_TRIAL, { userId: user.id });
      
      if (result && result.success) {
        // Update local user state
        const newUserState = {
          ...user,
          trialCount: result.trialCount
        };
        
        setUser(newUserState);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUserState));
        
        if (result.trialCount >= MAX_FREE_TRIALS) {
          toast({
            title: "Trial limit reached",
            description: "You've reached the limit of free trials. Please upgrade to continue using all features.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Trial usage",
            description: `You have ${MAX_FREE_TRIALS - result.trialCount} free trials remaining.`,
          });
        }
      }
    } catch (error) {
      console.error('Error updating trial count:', error);
    }
  };

  // Upgrade to subscription
  const upgradeToSubscription = async () => {
    if (!user) return;
    
    try {
      // For development - use localStorage implementation
      if (process.env.NODE_ENV === 'development' || true) { // Always use localStorage for now
        const users = JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || '{}');
        const updatedUser = users[user.email];
        
        if (updatedUser) {
          updatedUser.isSubscribed = true;
          users[user.email] = updatedUser;
          localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
          
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
        return;
      }
      
      // For production - use PHP API
      const result = await callApi(API_ENDPOINTS.UPGRADE, { userId: user.id });
      
      if (result && result.success) {
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
    } catch (error) {
      console.error('Error upgrading subscription:', error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Clear local state regardless of API call success
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem(AUTH_USER_KEY);
      
      // For production - call the logout API
      if (process.env.NODE_ENV !== 'development') {
        await fetch(API_ENDPOINTS.LOGOUT, {
          method: 'POST',
          credentials: 'include', // Include cookies for session management
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
    }
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
