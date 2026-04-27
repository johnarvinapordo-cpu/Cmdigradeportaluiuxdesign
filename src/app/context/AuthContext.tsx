import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (id: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo purposes
// In production, this would be replaced by an API call to the backend
const mockUsers: Record<string, { password: string; user: User }> = {
  'S2024001': {
    password: 'student123',
    user: {
      id: 'S2024001',
      name: 'Juan Dela Cruz',
      email: 'juan.delacruz@cmdi.edu.ph',
      role: 'student',
      studentId: 'S2024001',
    },
  },
  'T2024001': {
    password: 'teacher123',
    user: {
      id: 'T2024001',
      name: 'Prof. Maria Santos',
      email: 'maria.santos@cmdi.edu.ph',
      role: 'teacher',
      employeeId: 'T2024001',
    },
  },
  'R2024001': {
    password: 'registrar123',
    user: {
      id: 'R2024001',
      name: 'Ana Reyes',
      email: 'ana.reyes@cmdi.edu.ph',
      role: 'registrar',
      registrarId: 'R2024001',
    },
  },
  'F2024001': {
    password: 'finance123',
    user: {
      id: 'F2024001',
      name: 'Carlos Mendoza',
      email: 'carlos.mendoza@cmdi.edu.ph',
      role: 'finance',
      financeId: 'F2024001',
    },
  },
  'A2024001': {
    password: 'admin123',
    user: {
      id: 'A2024001',
      name: 'Admin Rodriguez',
      email: 'admin@cmdi.edu.ph',
      role: 'admin',
      employeeId: 'A2024001',
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (id: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const userRecord = mockUsers[id];
    if (userRecord && userRecord.password === password) {
      setUser(userRecord.user);
      setIsLoading(false);
      return true;
    }

    setError('Invalid credentials. Please check your ID and password.');
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error, clearError }}>
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

