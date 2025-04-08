
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface UserData {
  id: string;
  email: string;
  name: string | null;
  username?: string | null;
  avatar_url?: string | null;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: UserData | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<UserData>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  login: async () => {},
  signUp: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        
        if (newSession?.user) {
          const userData = {
            id: newSession.user.id,
            email: newSession.user.email!,
            name: newSession.user.user_metadata.name || null,
            username: newSession.user.user_metadata.username || null,
            avatar_url: newSession.user.user_metadata.avatar_url || null,
            isAdmin: newSession.user.user_metadata.isAdmin || false,
          };
          setUser(userData);
          setIsAuthenticated(true);
          setIsAdmin(!!userData.isAdmin);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        const userData = {
          id: currentSession.user.id,
          email: currentSession.user.email!,
          name: currentSession.user.user_metadata.name || null,
          username: currentSession.user.user_metadata.username || null,
          avatar_url: currentSession.user.user_metadata.avatar_url || null,
          isAdmin: currentSession.user.user_metadata.isAdmin || false,
        };
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(!!userData.isAdmin);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<UserData>) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            username: userData.username,
            avatar_url: userData.avatar_url,
          },
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isAuthenticated, 
      isAdmin, 
      isLoading,
      login, 
      signUp, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
