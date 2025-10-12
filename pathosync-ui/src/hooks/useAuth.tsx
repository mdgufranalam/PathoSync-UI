import { useState, useContext, createContext, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock current user - in real app this would come from Supabase
const mockCurrentUser: User = {
  id: '1',
  name: 'Dr. Admin',
  email: 'admin@healthcare.com',
  role: 'admin',
  createdAt: new Date().toISOString(),
  isActive: true
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(mockCurrentUser);

  const login = async (email: string, password: string) => {
    // Mock login - in real app this would authenticate with Supabase
    setCurrentUser(mockCurrentUser);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    
    const permissions = {
      admin: ['read', 'write', 'delete', 'manage_users', 'manage_doctors', 'manage_tests', 'manage_billing'],
      technician: ['read', 'write', 'manage_tests', 'manage_billing'],
      viewer: ['read']
    };

    return permissions[currentUser.role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}