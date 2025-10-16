import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'buyer' | 'farmer';
  avatar?: string;
  joinedDate: string;
  verified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: 'buyer' | 'farmer') => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'buyer' | 'farmer';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'buyer@test.com',
    phone: '+91 98765 43210',
    role: 'buyer' as const,
    joinedDate: '2024-01-15',
    verified: true,
  },
  {
    id: '2',
    name: 'Harpreet Singh',
    email: 'farmer@test.com',
    phone: '+91 98765 12345',
    role: 'farmer' as const,
    joinedDate: '2023-06-20',
    verified: true,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for existing session
    const stored = localStorage.getItem('agriconnect_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string, role: 'buyer' | 'farmer'): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demo: accept any password, just match email and role
    const foundUser = mockUsers.find(u => u.email === email && u.role === role);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('agriconnect_user', JSON.stringify(foundUser));
      return true;
    }

    // For demo: create new user if not found
    if (email && password.length >= 6) {
      const newUser: User = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        phone: '+91 00000 00000',
        role,
        joinedDate: new Date().toISOString().split('T')[0],
        verified: false,
      };
      setUser(newUser);
      localStorage.setItem('agriconnect_user', JSON.stringify(newUser));
      return true;
    }

    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      joinedDate: new Date().toISOString().split('T')[0],
      verified: false,
    };

    setUser(newUser);
    localStorage.setItem('agriconnect_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agriconnect_user');
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('agriconnect_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
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
