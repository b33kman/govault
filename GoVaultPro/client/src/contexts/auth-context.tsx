import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        console.log('Auth check returned:', response.status, 'running in demo mode');
        // For demo mode, create a mock user so dashboard displays
        setUser({
          id: 'demo-user-123',
          googleId: 'demo-user-123',
          email: 'demo@govault.family',
          name: 'Demo User',
          picture: null,
          role: 'Family Owner',
          createdAt: new Date(),
          lastActive: new Date(),
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // For demo mode, create a mock user so dashboard displays
      setUser({
        id: 'demo-user-123',
        googleId: 'demo-user-123',
        email: 'demo@govault.family',
        name: 'Demo User',
        picture: null,
        role: 'Family Owner',
        createdAt: new Date(),
        lastActive: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    // Redirect to Google OAuth
    window.location.href = '/auth/google';
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
