import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface User {
  id?: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  sessionToken: string | null;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Validate database session on load
  useEffect(() => {
    const validateStoredSession = async () => {
      const storedToken = localStorage.getItem('cryptoGuardSessionToken');
      const storedUser = localStorage.getItem('cryptoGuardUser');

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/auth/session', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.data?.valid && response.data.user) {
          setUser(response.data.user);
          setSessionToken(storedToken);
          setIsAuthenticated(true);
        } else {
          // Invalidate
          localStorage.removeItem('cryptoGuardSessionToken');
          localStorage.removeItem('cryptoGuardUser');
          setUser(null);
          setSessionToken(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.warn('Session verification failed, clearing stale session');
        localStorage.removeItem('cryptoGuardSessionToken');
        localStorage.removeItem('cryptoGuardUser');
        setUser(null);
        setSessionToken(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateStoredSession();
  }, []);

  const login = (token: string, newUser: User) => {
    setUser(newUser);
    setSessionToken(token);
    setIsAuthenticated(true);
    localStorage.setItem('cryptoGuardSessionToken', token);
    localStorage.setItem('cryptoGuardUser', JSON.stringify(newUser));
  };

  const logout = async () => {
    const currentToken = sessionToken || localStorage.getItem('cryptoGuardSessionToken');
    if (currentToken) {
      try {
        await axios.post('/api/auth/logout', {}, {
          headers: { Authorization: `Bearer ${currentToken}` }
        });
      } catch (e) {
        console.error('Logout error', e);
      }
    }

    setUser(null);
    setSessionToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('cryptoGuardSessionToken');
    localStorage.removeItem('cryptoGuardUser');
  };

  return (
    <AuthContext.Provider value={{ user, sessionToken, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
